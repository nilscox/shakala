import expect from '@nilscox/expect';
import { beforeEach, describe, it } from 'vitest';

import { MockHttpResponse, StubHttpAdapter } from '../../http/stub-http.adapter';

import { ApiThreadAdapter } from './api-thread.adapter';

describe('ApiThreadAdapter', () => {
  let adapter: ApiThreadAdapter;
  let mockResponse: MockHttpResponse;

  beforeEach(() => {
    const http = new StubHttpAdapter();
    adapter = new ApiThreadAdapter(http);

    mockResponse = http.mock('GET', '/api/account');
  });

  it('fetches the last threads', async () => {
    mockResponse({ body: [{ id: 'threadId' }] });

    await expect(adapter.getLastThreads(3)).toResolve([expect.objectWith({ id: 'threadId' })]);
  });
});
