import expect from '@nilscox/expect';
import { QueryClient } from 'react-query';
import { describe, it } from 'vitest';

import { ApiThreadAdapter } from '../adapters/api/thread/api-thread.adapter';
import { FetchHttpAdapter } from '../adapters/http/fetch-http.adapter';

import { prefetchQuery } from './prefetch-query';

describe('prefetchQuery', () => {
  it('prefetches a query with redux-query as an authenticated user', async () => {
    const client = new QueryClient();

    const http = new FetchHttpAdapter();
    const adapter = new ApiThreadAdapter(http);

    let headers: Headers | undefined;

    adapter.getThread = async function () {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      headers = (this as any).http.headers;
      return undefined;
    };

    await prefetchQuery(adapter, 'getThread', '42')(client, 'token');

    expect.assert(headers);
    expect(headers.get('cookie')).toEqual('token=token');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((http as any).headers.get('cookie')).toBe(null);
  });
});