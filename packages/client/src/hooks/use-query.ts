import { Token } from 'brandi';
import { useInjection } from 'brandi-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { QueryKey, useQuery as useReactQuery, useQueryClient } from 'react-query';

import { Page } from '~/utils/page';
import { getQueryKey, QueryAdapter } from '~/utils/query-key';

export const useQuery = <Adapter extends QueryAdapter<Method>, Method extends keyof Adapter>(
  adapterToken: Token<Adapter>,
  method: Method,
  ...params: Parameters<Adapter[Method]>
) => {
  const adapter = useInjection(adapterToken);
  const queryKey = getQueryKey(adapterToken, method, ...params);

  const { data, error } = useReactQuery(
    queryKey,
    () => {
      return adapter[method](...params);
    },
    {
      keepPreviousData: true,
    }
  );

  if (error) {
    throw error;
  }

  return data as Awaited<ReturnType<Adapter[Method]>>;
};

export const usePaginatedQuery = <Adapter extends QueryAdapter<Method>, Method extends keyof Adapter>(
  adapterToken: Token<Adapter>,
  method: Method,
  getParams: (page: number) => Parameters<Adapter[Method]>
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type Data = Adapter[Method] extends (...args: any[]) => Promise<Page<infer Data>> ? Data : never;

  const adapter = useInjection(adapterToken);

  const [page, setPage] = useState(1);
  const params = getParams(page);
  const queryKey = getQueryKey(adapterToken, method, ...params);

  const locked = useRef(false);

  const [items, setItems] = useState<Data[]>();
  const [total, setTotal] = useState<number>();

  const { data, error } = useReactQuery({
    queryKey,
    queryFn: () => adapter[method](...params),
    keepPreviousData: true,
  });

  useEffect(() => {
    if (data) {
      setTotal(data.total);
      setItems((items) => [...(items ?? []), ...data.items]);
      locked.current = false;
    }
  }, [data]);

  if (error) {
    throw error;
  }

  const hasMore = Boolean(items && total && items.length < total);

  const loadMore = useCallback(() => {
    if (!locked.current) {
      locked.current = true;
      setPage((page) => page + 1);
    }
  }, []);

  return [items ?? data?.items, { hasMore: hasMore, loadMore }] as const;
};

export const useInvalidateQuery = () => {
  const queryClient = useQueryClient();

  return useCallback(
    (queryKey: QueryKey) => {
      if (queryKey.length === 0) {
        return queryClient.clear();
      }

      return queryClient.invalidateQueries({ queryKey });
    },
    [queryClient]
  );
};
