import 'reflect-metadata';
import { FormData } from '@remix-run/node';
import { MockedObject } from 'vitest';

import { createUser } from '~/factories';

import { AuthenticationController } from './authentication.controller';
import {
  AuthenticationService,
  EmailAlreadyExistsError,
  InvalidCredentialsError,
} from './authentication.service';
import { StubSessionService } from './session.service';
import { ValidationService } from './validation.service';

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
    const input = new FormData();
    const user = createUser();

    beforeEach(() => {
      input.set('email', 'email@domain.tld');
      input.set('password', 'password');
    });

    it('logs in as an existing user', async () => {
      authenticationService.login.mockResolvedValueOnce(user);

      const response = await controller.login(input);

      expect(response).toHaveStatus(200);
      expect(await response.json()).toEqual(user);

      expect(authenticationService.login).toHaveBeenCalledWith('email@domain.tld', 'password');
    });

    it('logs in as an existing user', async () => {
      authenticationService.login.mockResolvedValueOnce(user);

      const response = await controller.login(input);

      expect(response).toHaveHeader('Set-Cookie');
      expect(sessionService.session?.get('userId')).toEqual(user.id);
    });

    it('fails to log in when the form data is invalid', async () => {
      input.delete('password');

      const response = await controller.login(input);

      expect(response).toHaveStatus(400);
      expect(await response.json()).toEqual({
        error: 'ValidationError',
        password: ['isString'],
      });
    });

    it('handles InvalidCredentials errors', async () => {
      authenticationService.login.mockRejectedValueOnce(new InvalidCredentialsError());

      const response = await controller.login(input);

      expect(response).toHaveStatus(401);
      expect(await response.json()).toEqual({
        error: 'InvalidCredentials',
      });
    });
  });

  describe('signup', () => {
    const input = new FormData();
    const user = createUser();

    beforeEach(() => {
      input.set('email', 'email@domain.tld');
      input.set('password', 'password');
      input.set('nick', 'boubou');
    });

    it('signs up in as a new user', async () => {
      authenticationService.signup.mockResolvedValueOnce(user);

      const response = await controller.signup(input);

      expect(response).toHaveStatus(201);
      expect(await response.json()).toEqual(user);

      expect(authenticationService.signup).toHaveBeenCalledWith('email@domain.tld', 'password', 'boubou');
    });

    it("saves the user's id to its session", async () => {
      authenticationService.signup.mockResolvedValueOnce(user);

      const response = await controller.signup(input);

      expect(response).toHaveHeader('Set-Cookie');
      expect(sessionService.session?.get('userId')).toEqual(user.id);
    });

    it('fails to log in when the form data is invalid', async () => {
      input.set('nick', 'bou');

      const response = await controller.signup(input);

      expect(response).toHaveStatus(400);
      expect(await response.json()).toEqual({
        error: 'ValidationError',
        nick: ['minLength'],
      });
    });

    it('handles EmailAlreadyExists errors', async () => {
      authenticationService.signup.mockRejectedValueOnce(new EmailAlreadyExistsError('email@domain.tld'));

      const response = await controller.signup(input);

      expect(response).toHaveStatus(400);
      expect(await response.json()).toEqual({
        error: 'EmailAlreadyExists',
      });
    });
  });
});
