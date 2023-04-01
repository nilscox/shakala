import { AnyFunction, assert } from '@shakala/shared';
import { Token } from 'brandi';

import { container } from '~/app/container';
import { TOKENS } from '~/app/tokens';
import { PageContextServer, Query } from '~/renderer/page-context';

import { ApiFetchHttpAdapter } from '../adapters/http/fetch-http.adapter';

type QueryParameters<Adapter extends Record<Method, AnyFunction>, Method extends keyof Adapter> = [
  adapterToken: Token<Adapter>,
  method: Method,
  ...params: Parameters<Adapter[Method]>
];

export function prefetchQuery<Adapter extends Record<Method, AnyFunction>, Method extends keyof Adapter>(
  ...parameters: QueryParameters<Adapter, Method>
): Query;

export function prefetchQuery<Adapter extends Record<Method, AnyFunction>, Method extends keyof Adapter>(
  getQuery: (pageContext: PageContextServer) => QueryParameters<Adapter, Method> | void
): Query;

export function prefetchQuery<Adapter extends Record<Method, AnyFunction>, Method extends keyof Adapter>(
  ...args: unknown[]
): Query {
  const http = container.get(TOKENS.http);

  assert(http instanceof ApiFetchHttpAdapter, 'expected http to be instance of ApiFetchHttpAdapter');

  return async (pageContext, token) => {
    let adapterToken: Token<Adapter>;
    let method: Method;
    let params: Parameters<Adapter[Method]>;

    if (args.length === 1) {
      const getQuery = args[0] as (pageContext: PageContextServer) => QueryParameters<Adapter, Method> | void;
      const result = getQuery(pageContext);

      if (!result) {
        return;
      }

      [adapterToken, method, ...params] = result;
    } else {
      [adapterToken, method, ...params] = args as [Token<Adapter>, Method, ...Parameters<Adapter[Method]>];
    }

    const adapter = container.get(adapterToken);
    const queryKey = [adapter.constructor.name, method, params];

    await pageContext.queryClient.prefetchQuery(queryKey, async () => {
      const httpClone = http.clone();

      if (token) {
        httpClone.setToken(token);
      }

      const cb = adapter[method];
      assert(typeof cb === 'function');

      return cb.call({ ...adapter, http: httpClone }, ...params);
    });
  };
}
