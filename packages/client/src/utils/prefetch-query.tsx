import { Methods } from '@shakala/shared';
import { QueryClient } from 'react-query';

export type PrefetchQuery = <
  Adapter extends object,
  AdapterMethods extends Methods<Adapter>,
  Method extends keyof AdapterMethods
>(
  adapter: AdapterMethods,
  method: Method,
  ...params: Parameters<AdapterMethods[Method]>
) => (queryClient: QueryClient) => Promise<void>;

export const prefetchQuery: PrefetchQuery = (adapter, method, ...params) => {
  return async (queryClient) => {
    const key = [adapter.constructor.name, method, params];

    await queryClient.prefetchQuery(key, async () => {
      return adapter[method](...params);
    });
  };
};
