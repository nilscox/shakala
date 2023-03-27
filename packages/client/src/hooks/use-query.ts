import { AnyFunction } from '@shakala/shared';
import { useQuery as useReactQuery } from 'react-query';

export const useQuery = <Adapter extends Record<Method, AnyFunction>, Method extends keyof Adapter>(
  adapter: Adapter,
  method: Method,
  ...params: Parameters<Adapter[Method]>
) => {
  const { data, error } = useReactQuery([adapter.constructor.name, method, params], () => {
    return adapter[method](...params);
  });

  if (error) {
    throw error;
  }

  return data as Awaited<ReturnType<Adapter[Method]>>;
};
