import expect from '@nilscox/expect';
import { QueryClient } from 'react-query';
import { describe, it } from 'vitest';

import { StubThreadAdapter } from '~/adapters/api/thread/stub-thread.adapter';
import { container } from '~/app/container';
import { TOKENS } from '~/app/tokens';
import { PageContextServer } from '~/renderer/page-context';

import { ApiThreadAdapter } from '../adapters/api/thread/api-thread.adapter';
import { ApiFetchHttpAdapter } from '../adapters/http/fetch-http.adapter';

import { prefetchQuery } from './prefetch-query';

describe('prefetchQuery', () => {
  it('prefetches a query with redux-query as an authenticated user', async () => {
    const queryClient = new QueryClient();
    const pageContext = { queryClient } as PageContextServer;

    const http = new ApiFetchHttpAdapter({ apiBaseUrl: '' });
    const adapter = new ApiThreadAdapter(http);

    container.bind(TOKENS.thread).toConstant(adapter);

    let headers: Headers | undefined;

    adapter.getThread = async function () {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      headers = (this as any).http.headers;
      return undefined;
    };

    await prefetchQuery(TOKENS.thread, 'getThread', '42')(pageContext, 'token');

    expect.assert(headers);
    expect(headers.get('cookie')).toEqual('token=token');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((http as any).headers.get('cookie')).toBe(null);
  });

  it('prefetches a query depending on the page context', async () => {
    const queryClient = new QueryClient();

    const routeParams: Record<string, string> = { threadId: 'threadId' };
    const pageContext = { queryClient, routeParams } as PageContextServer;

    const adapter = new StubThreadAdapter();

    container.bind(TOKENS.thread).toConstant(adapter);

    await prefetchQuery(({ routeParams }) => [TOKENS.thread, 'getThread', routeParams.threadId])(pageContext);

    expect(adapter.getThread).calledWith('threadId');
  });

  it('does not prefetch a query when the callback returns undefined', async () => {
    const queryClient = new QueryClient();

    const routeParams: Record<string, string> = { threadId: 'threadId' };
    const pageContext = { queryClient, routeParams } as PageContextServer;

    const adapter = new StubThreadAdapter();

    container.bind(TOKENS.thread).toConstant(adapter);

    await prefetchQuery(() => {})(pageContext);
  });
});
