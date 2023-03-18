import { beforeEach } from 'node:test';

import expect from '@nilscox/expect';
import { describe, it } from 'vitest';

import { MockHttpResponse, StubHttpAdapter } from '../../http/stub-http.adapter';

import { ApiAuthenticationAdapter } from './api-authentication.adapter';

describe('ApiAuthenticationAdapter', () => {
  let adapter: ApiAuthenticationAdapter;
  let mockResponse: MockHttpResponse;

  beforeEach(() => {
    const http = new StubHttpAdapter();
    adapter = new ApiAuthenticationAdapter(http);

    mockResponse = http.mock('GET', '/api/account');
  });

  it("fetches the authenticated user's account information", async () => {
    mockResponse({ body: { id: 'userId', nick: 'nick' } });

    await expect(adapter.getAuthenticatedUser()).toResolve({ id: 'userId', nick: 'nick' });
  });

  it('returns undefined when the user is not authenticated', async () => {
    mockResponse({ status: 404 });

    await expect(adapter.getAuthenticatedUser()).toResolve(undefined);
  });
});
