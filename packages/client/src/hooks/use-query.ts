import { Methods } from '@shakala/shared';
import { useQuery as useReactQuery } from 'react-query';

export const useQuery = <
  Adapter extends object,
  AdapterMethods extends Methods<Adapter>,
  Method extends keyof AdapterMethods
>(
  adapter: AdapterMethods,
  method: Method,
  ...params: Parameters<AdapterMethods[Method]>
) => {
  const { data, error } = useReactQuery([adapter.constructor.name, method, params], () => {
    return adapter[method](...params);
  });

  if (error) {
    throw error;
  }

  return data as Awaited<ReturnType<AdapterMethods[Method]>>;
};
