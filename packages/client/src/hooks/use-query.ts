import { Token } from 'brandi';
import { useInjection } from 'brandi-react';
import { useQuery as useReactQuery } from 'react-query';

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
