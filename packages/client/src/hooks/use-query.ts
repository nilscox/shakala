import { AnyFunction } from '@shakala/shared';
import { Token } from 'brandi';
import { useInjection } from 'brandi-react';
import { useQuery as useReactQuery } from 'react-query';

export const useQuery = <Adapter extends Record<Method, AnyFunction>, Method extends keyof Adapter>(
  adapterToken: Token<Adapter>,
  method: Method,
  ...params: Parameters<Adapter[Method]>
) => {
  const adapter = useInjection(adapterToken);
  const queryKey = [adapter.constructor.name, method, params];

  const { data, error } = useReactQuery(queryKey, () => {
    return adapter[method](...params);
  });

  if (error) {
    throw error;
  }

  return data as Awaited<ReturnType<Adapter[Method]>>;
};
