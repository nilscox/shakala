import expect from '@nilscox/expect';
import { createUserDto } from '@shakala/shared';
import { beforeEach, describe, it } from 'vitest';

import { StubHttpAdapter } from '../../http/stub-http.adapter';

import { ApiAuthenticationAdapter } from './api-authentication.adapter';

describe('ApiAuthenticationAdapter', () => {
  let http: StubHttpAdapter;
  let adapter: ApiAuthenticationAdapter;

  beforeEach(() => {
    http = new StubHttpAdapter();
    adapter = new ApiAuthenticationAdapter(http);
  });

  describe('getAuthenticatedUser', () => {
    it("fetches the authenticated user's account information", async () => {
      const user = createUserDto();

      http.response = { body: user };

      await expect(adapter.getAuthenticatedUser()).toResolve(user);

      expect(http.requests).toInclude({ method: 'GET', url: '/account' });
    });

    it('returns undefined when the user is not authenticated', async () => {
      http.response = { status: 401 };

      await expect(adapter.getAuthenticatedUser()).toResolve(undefined);
    });
  });

  describe('signUp', () => {
    it('signs up', async () => {
      http.response = { body: createUserDto() };

      await expect(adapter.signUp('nick', 'email', 'password')).toResolve();

      expect(http.requests).toInclude({
        method: 'POST',
        url: '/auth/sign-up',
        body: { nick: 'nick', email: 'email', password: 'password' },
      });
    });

    it('handles AlreadyAuthenticated error', async () => {
      http.error = { code: 'UnauthorizedError' };

      await expect(adapter.signUp('nick', 'email', 'password')).toReject(new Error('AlreadyAuthenticated'));
    });
  });

  describe('signIn', () => {
    it('signs in', async () => {
      http.response = { body: createUserDto() };

      await expect(adapter.signIn('email', 'password')).toResolve();

      expect(http.requests).toInclude({
        method: 'POST',
        url: '/auth/sign-in',
        body: { email: 'email', password: 'password' },
      });
    });

    it('handles InvalidCredentials error', async () => {
      http.error = { code: 'InvalidCredentialsError' };

      await expect(adapter.signIn('email', 'password')).toReject(new Error('InvalidCredentials'));
    });

    it('handles AlreadyAuthenticated error', async () => {
      http.error = { code: 'UnauthorizedError' };

      await expect(adapter.signIn('email', 'password')).toReject(new Error('AlreadyAuthenticated'));
    });
  });

  describe('signOut', () => {
    it('signs out', async () => {
      http.response = {};

      await expect(adapter.signOut()).toResolve();

      expect(http.requests).toInclude({
        method: 'POST',
        url: '/auth/sign-out',
      });
    });
  });
});
