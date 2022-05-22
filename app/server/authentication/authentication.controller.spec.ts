import 'reflect-metadata';
import { FormData } from '@remix-run/node';
import { MockedObject } from 'vitest';

import { StubSessionService } from '~/server/common/session.service';
import { ValidationService } from '~/server/common/validation.service';
import { createRequest, CreateRequestOptions } from '~/server/test/create-request';
import { createUserEntity } from '~/server/test/factories';

import { AuthenticationController } from './authentication.controller';
import {
  AuthenticationService,
  EmailAlreadyExistsError,
  InvalidCredentialsError,
} from './authentication.service';

describe('AuthenticationController', () => {
  const sessionService = new StubSessionService();

  const authenticationService = {
    login: vi.fn(),
    signup: vi.fn(),
  } as MockedObject<AuthenticationService>;

  const controller = new AuthenticationController(
    sessionService,
    authenticationService,
    new ValidationService(),
  );

  describe('login', () => {
    const form = new FormData();
    const user = createUserEntity();

    beforeEach(() => {
      form.set('email', 'email@domain.tld');
      form.set('password', 'password');
    });

    const login = async (options?: CreateRequestOptions) => {
      return controller.login(createRequest({ form, ...options }));
    };

    it('logs in as an existing user', async () => {
      authenticationService.login.mockResolvedValueOnce(user);

      const response = await login();

      expect(response).toHaveStatus(200);
      expect(await response.json()).toEqual(user);

      expect(authenticationService.login).toHaveBeenCalledWith('email@domain.tld', 'password');
    });

    it('logs in as an existing user', async () => {
      authenticationService.login.mockResolvedValueOnce(user);

      const response = await login();

      expect(response).toHaveHeader('Set-Cookie');
      expect(sessionService.session?.get('userId')).toEqual(user.id);
    });

    it('redirects when the url has a "next" form field', async () => {
      authenticationService.login.mockResolvedValueOnce(user);

      const response = await login({ searchParams: new URLSearchParams({ next: '/profile' }) });

      expect(response).toHaveStatus(302);
      expect(response).toHaveHeader('Location', '/profile');
    });

    it('fails to log in when the form data is invalid', async () => {
      form.delete('password');

      const response = await login();

      expect(response).toHaveStatus(400);
      expect(await response.json()).toEqual({
        error: 'ValidationError',
        password: ['isString'],
      });
    });

    it('handles InvalidCredentials errors', async () => {
      authenticationService.login.mockRejectedValueOnce(new InvalidCredentialsError());

      const response = await login();

      expect(response).toHaveStatus(401);
      expect(await response.json()).toEqual({
        error: 'InvalidCredentials',
      });
    });
  });

  describe('signup', () => {
    const form = new FormData();
    const user = createUserEntity();

    beforeEach(() => {
      form.set('email', 'email@domain.tld');
      form.set('password', 'password');
      form.set('nick', 'boubou');
    });

    const signup = async (options?: CreateRequestOptions) => {
      return controller.signup(createRequest({ form, ...options }));
    };

    it('signs up in as a new user', async () => {
      authenticationService.signup.mockResolvedValueOnce(user);

      const response = await signup();

      expect(response).toHaveStatus(201);
      expect(await response.json()).toEqual(user);

      expect(authenticationService.signup).toHaveBeenCalledWith('email@domain.tld', 'password', 'boubou');
    });

    it("saves the user's id to its session", async () => {
      authenticationService.signup.mockResolvedValueOnce(user);

      const response = await signup();

      expect(response).toHaveHeader('Set-Cookie');
      expect(sessionService.session?.get('userId')).toEqual(user.id);
    });

    it('redirects when the url has a "next" search param', async () => {
      authenticationService.signup.mockResolvedValueOnce(user);

      const response = await signup({ searchParams: new URLSearchParams({ next: '/profile' }) });

      expect(response).toHaveStatus(302);
      expect(response).toHaveHeader('Location', '/profile');
    });

    it('fails to sign up when the form data is invalid', async () => {
      form.set('nick', 'bou');

      const response = await signup();

      expect(response).toHaveStatus(400);
      expect(await response.json()).toEqual({
        error: 'ValidationError',
        nick: ['minLength'],
      });
    });

    it('handles EmailAlreadyExists errors', async () => {
      authenticationService.signup.mockRejectedValueOnce(new EmailAlreadyExistsError('email@domain.tld'));

      const response = await signup();

      expect(response).toHaveStatus(400);
      expect(await response.json()).toEqual({
        error: 'ValidationError',
        email: ['alreadyExists'],
      });
    });
  });
});
