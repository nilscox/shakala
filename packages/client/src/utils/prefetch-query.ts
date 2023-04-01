import { assert } from '@shakala/shared';
import { Token } from 'brandi';

import { container } from '~/app/container';
import { TOKENS } from '~/app/tokens';
import { PageContextServer, PrefetchQuery } from '~/renderer/page-context';

import { ApiFetchHttpAdapter } from '../adapters/http/fetch-http.adapter';

import { getQueryKey, QueryAdapter, QueryParameters } from './query-key';

type GetQuery<Adapter extends QueryAdapter<Method>, Method extends keyof Adapter> = (
  pageContext: PageContextServer
) => QueryParameters<Adapter, Method> | void;

export function prefetchQuery<Adapter extends QueryAdapter<Method>, Method extends keyof Adapter>(
  ...parameters: QueryParameters<Adapter, Method>
): PrefetchQuery;

export function prefetchQuery<Adapter extends QueryAdapter<Method>, Method extends keyof Adapter>(
  getQuery: GetQuery<Adapter, Method>
): PrefetchQuery;

export function prefetchQuery<Adapter extends QueryAdapter<Method>, Method extends keyof Adapter>(
  ...args: unknown[]
): PrefetchQuery {
  const http = container.get(TOKENS.http);

  assert(http instanceof ApiFetchHttpAdapter, 'expected http to be instance of ApiFetchHttpAdapter');

  return async (pageContext, token) => {
    let adapterToken: Token<Adapter>;
    let method: Method;
    let params: Parameters<Adapter[Method]>;

    if (args.length === 1) {
      const getQuery = args[0] as GetQuery<Adapter, Method>;
      const result = getQuery(pageContext);

      if (!result) {
        return;
      }

      [adapterToken, method, ...params] = result;
    } else {
      [adapterToken, method, ...params] = args as QueryParameters<Adapter, Method>;
    }

    const adapter = container.get(adapterToken);
    const queryKey = getQueryKey(adapterToken, method, ...params);

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
