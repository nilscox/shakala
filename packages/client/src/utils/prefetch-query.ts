import { AnyFunction } from '@shakala/shared';
import { Token } from 'brandi';

import { container } from '~/app/container';
import { TOKENS } from '~/app/tokens';

import { ApiFetchHttpAdapter } from '../adapters/http/fetch-http.adapter';
import { Query } from '../app/page-context';

import { assert } from './assert';

export type PrefetchQuery = <Adapter extends Record<Method, AnyFunction>, Method extends keyof Adapter>(
  adapterToken: Token<Adapter>,
  method: Method,
  ...params: Parameters<Adapter[Method]>
) => Query;

export const prefetchQuery: PrefetchQuery = (adapterToken, method, ...params) => {
  const http = container.get(TOKENS.http);

  assert(http instanceof ApiFetchHttpAdapter, 'expected http to be instance of ApiFetchHttpAdapter');

  return async (queryClient, token) => {
    const adapter = container.get(adapterToken);
    const key = [adapter.constructor.name, method, params];

    await queryClient.prefetchQuery(key, async () => {
      if (token) {
        http.setToken(token);
      }

      const cb = adapter[method];
      assert(typeof cb === 'function');

      return cb.call({ ...adapter, http }, ...params);
    });
  };
};
