import expect from '@nilscox/expect';
import { beforeEach, describe, it } from 'vitest';

import { MockHttpResponse, StubHttpAdapter } from '../../http/stub-http.adapter';

import { ApiAuthenticationAdapter } from './api-authentication.adapter';

describe('ApiAuthenticationAdapter', () => {
  let http: StubHttpAdapter;
  let adapter: ApiAuthenticationAdapter;
  let mockResponse: MockHttpResponse;

  beforeEach(() => {
    http = new StubHttpAdapter();
    adapter = new ApiAuthenticationAdapter(http);
  });

  describe('getAuthenticatedUser', () => {
    beforeEach(() => {
      mockResponse = http.mock('GET', '/account');
    });

    it("fetches the authenticated user's account information", async () => {
      mockResponse({ body: { id: 'userId', nick: 'nick' } });

      await expect(adapter.getAuthenticatedUser()).toResolve({ id: 'userId', nick: 'nick' });
    });

    it('returns undefined when the user is not authenticated', async () => {
      mockResponse({ status: 401 });

      await expect(adapter.getAuthenticatedUser()).toResolve(undefined);
    });
  });

  describe('signUp', () => {
    beforeEach(() => {
      mockResponse = http.mock('POST', '/auth/sign-up', {
        body: { nick: 'nick', email: 'email', password: 'password' },
      });

      mockResponse({});
    });

    it('signs in', async () => {
      await expect(adapter.signUp('nick', 'email', 'password')).toResolve();
    });
  });

  describe('signIn', () => {
    beforeEach(() => {
      mockResponse = http.mock('POST', '/auth/sign-in', {
        body: { email: 'email', password: 'password' },
      });

      mockResponse({});
    });

    it('signs in', async () => {
      await expect(adapter.signIn('email', 'password')).toResolve();
    });
  });
});
