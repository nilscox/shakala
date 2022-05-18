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

describe('AuthenticationController', () => {
  const sessionService = new StubSessionService();

  const authenticationService = {
    login: vi.fn(),
    signup: vi.fn(),
  } as MockedObject<AuthenticationService>;

  const controller = new AuthenticationController(sessionService, authenticationService);

  describe('login', () => {
    const input = new FormData();
    const user = createUser();

    beforeEach(() => {
      input.set('email', 'email@domain.tld');
      input.set('password', 'password');
    });

    it('logs in as an existing user', async () => {
      authenticationService.login.mockResolvedValueOnce(user);

      const [loggedInUser] = await controller.login(input);

      await expect(loggedInUser).toEqual(user);
      expect(authenticationService.login).toHaveBeenCalledWith('email@domain.tld', 'password');
    });

    it("saves the user's id to its session", async () => {
      authenticationService.login.mockResolvedValueOnce(user);

      const [, session] = await controller.login(input);

      expect(session.get('userId')).toEqual(user.id);
    });

    it('fails to log in when the form data is invalid', async () => {
      input.delete('password');

      await expect(controller.login(input)).rejects.toEqualResponse({ status: 400 });
    });

    it('handles InvalidCredentials errors', async () => {
      authenticationService.login.mockRejectedValueOnce(new InvalidCredentialsError());

      await expect(controller.login(input)).rejects.toEqualResponse({
        status: 401,
        body: {
          error: 'InvalidCredentials',
        },
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

      const [signedUpUser] = await controller.signup(input);

      expect(signedUpUser).toEqual(user);
      expect(authenticationService.signup).toHaveBeenCalledWith('email@domain.tld', 'password', 'boubou');
    });

    it("saves the user's id to its session", async () => {
      authenticationService.signup.mockResolvedValueOnce(user);

      const [, session] = await controller.signup(input);

      expect(session.get('userId')).toEqual(user.id);
    });

    it('fails to log in when the form data is invalid', async () => {
      input.set('nick', 'bou');

      await expect(controller.signup(input)).rejects.toEqualResponse({ status: 400 });
    });

    it('handles EmailAlreadyExists errors', async () => {
      authenticationService.signup.mockRejectedValueOnce(new EmailAlreadyExistsError('email@domain.tld'));

      await expect(controller.signup(input)).rejects.toEqualResponse({
        status: 400,
        body: {
          error: 'EmailAlreadyExists',
        },
      });
    });
  });
});
