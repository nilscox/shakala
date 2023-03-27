import { AnyFunction } from '@shakala/shared';

import { FetchHttpAdapter } from '../adapters/http/fetch-http.adapter';
import { Query } from '../app/page-context';

import { assert } from './assert';

export type PrefetchQuery = <Adapter extends Record<Method, AnyFunction>, Method extends keyof Adapter>(
  adapter: Adapter,
  method: Method,
  ...params: Parameters<Adapter[Method]>
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
