import { AnyFunction, Methods } from '@shakala/shared';

import { FetchHttpAdapter } from '../adapters/http/fetch-http.adapter';
import { Query } from '../app/page-context';

import { assert } from './assert';

export type PrefetchQuery = <Adapter extends object, Method extends keyof Methods<Adapter>>(
  adapter: Adapter,
  method: Method,
  ...params: Adapter[Method] extends AnyFunction ? Parameters<Adapter[Method]> : never
) => Query;

export const prefetchQuery: PrefetchQuery = (adapter, method, ...params) => {
  return async (queryClient, token) => {
    const key = [adapter.constructor.name, method, params];

    await queryClient.prefetchQuery(key, async () => {
      const http = new FetchHttpAdapter('http://localhost:8000/api');

      if (token) {
        http.setToken(token);
      }

      const cb = adapter[method];
      assert(typeof cb === 'function');

      return cb.call({ ...adapter, http }, ...params);
    });
  };
};
