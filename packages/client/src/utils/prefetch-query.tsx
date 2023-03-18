import { Methods } from '@shakala/shared';

import { ApiAdapter } from '../adapters/api/api-adapter';
import { Query } from '../app/page-context';

import { assert } from './assert';

export type PrefetchQuery = <
  Adapter extends ApiAdapter,
  AdapterMethods extends Methods<Adapter>,
  Method extends keyof AdapterMethods
>(
  adapter: Adapter,
  method: Method,
  ...params: Parameters<AdapterMethods[Method]>
) => Query;

export const prefetchQuery: PrefetchQuery = (adapter, method, ...params) => {
  return async (queryClient, token) => {
    const key = [adapter.constructor.name, method, params];

    await queryClient.prefetchQuery(key, async () => {
      const adapterWithToken = adapter.withToken(token);
      const cb = adapterWithToken[method as keyof typeof adapterWithToken];

      assert(typeof cb === 'function');

      return cb.call(adapterWithToken, ...params);
    });
  };
};
