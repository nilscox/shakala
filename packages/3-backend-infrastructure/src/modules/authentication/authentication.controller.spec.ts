import {
  ExecutionContext,
  GetUserByEmailQuery,
  LoginCommand,
  SignOutCommand,
  SignupCommand,
  ValidateEmailAddressCommand,
} from 'backend-application';
import { factories } from 'backend-domain';
import {
  AuthorizationError,
  EmailAlreadyExistsError,
  EmailValidationFailed,
  EmailValidationFailedReason,
  get,
  LoginBodyDto,
  NickAlreadyExistsError,
  NotImplemented,
  SignupBodyDto,
} from 'shared';
import { mockReject } from 'shared/test';

import { Request, StubConfigAdapter, ValidationError, ValidationService } from '../../infrastructure';
import { MockLoggerAdapter } from '../../infrastructure/test';
import { MockCommandBus, MockQueryBus, MockRequest, StubSessionAdapter } from '../../test';
import { UserPresenter } from '../user/user.presenter';

import { AuthenticationController } from './authentication.controller';

describe('AuthenticationController', () => {
  const config = new StubConfigAdapter({ app: { appBaseUrl: 'http://app.url' } });
  const session = new StubSessionAdapter();
  const queryBus = new MockQueryBus();
  const commandBus = new MockCommandBus();

  const controller = new AuthenticationController(
    new MockLoggerAdapter(),
    config,
    new ValidationService(),
    session,
    queryBus,
    commandBus,
    new UserPresenter(config),
  );

  const create = factories();

  const ctx = ExecutionContext.unauthenticated;

  describe('login', () => {
    const body: LoginBodyDto = { email: 'user@email.tld', password: 'p4ssw0rd' };
    const user = create.user();

    beforeEach(() => {
      queryBus.for(GetUserByEmailQuery).return(user);
    });

    const login = async (req?: Request) => {
      return controller.login(req ?? new MockRequest().withBody(body));
    };

    it('logs in as an existing user', async () => {
      const response = await login();

      expect(response).toHaveStatus(200);
      expect(response).toHaveBody({
        id: user.id,
        nick: user.nick.toString(),
        email: user.email,
        profileImage: undefined,
        signupDate: user.signupDate.toString(),
      });

      expect(commandBus.execute).toHaveBeenCalledWith(new LoginCommand(body.email, body.password), ctx);
      expect(session.user).toEqual(user);
    });

    it('fails to log in when the body is invalid', async () => {
      await expect.rejects(login(new MockRequest().withBody({}))).with(ValidationError);
    });
  });

  describe('signup', () => {
    const body: SignupBodyDto = { nick: 'nick', email: 'user@domain.tld', password: 'p4ssw0rd' };
    const user = create.user();

    beforeEach(() => {
      queryBus.for(GetUserByEmailQuery).return(user);
    });

    const signup = async (req?: Request) => {
      return controller.signup(req ?? new MockRequest().withBody(body));
    };

    it('signs up in as a new user', async () => {
      const response = await signup();

      expect(response).toHaveStatus(201);
      expect(response).toHaveBody(expect.objectWithId(user.id));

      expect(commandBus.execute).toHaveBeenCalledWith(
        new SignupCommand(body.nick, body.email, body.password),
        ctx,
      );

      expect(session.user).toEqual(user);
    });

    it('fails to sign up when the body is invalid', async () => {
      await expect.rejects(signup(new MockRequest().withBody({}))).with(ValidationError);
    });

    it('handles EmailAlreadyExists errors', async () => {
      commandBus.execute = mockReject(new EmailAlreadyExistsError(body.email));

      const error = await expect.rejects(signup()).with(ValidationError);

      expect(get(error, 'details', 'fields', '0')).toEqual({
        field: 'email',
        error: 'alreadyExists',
        value: body.email,
      });
    });

    it('handles NickAlreadyExists errors', async () => {
      commandBus.execute = mockReject(new NickAlreadyExistsError(body.nick));

      const error = await expect.rejects(signup()).with(ValidationError);

      expect(get(error, 'details', 'fields', '0')).toEqual({
        field: 'nick',
        error: 'alreadyExists',
        value: body.nick,
      });
    });
  });

  describe('validateEmailAddress', () => {
    const params = { userId: 'userId', token: 'token' };
    const user = create.user();

    beforeEach(() => {
      queryBus.for(GetUserByEmailQuery).return(user);
    });

    const validateEmailAddress = async () => {
      return controller.validateEmailAddress(new MockRequest().withParams(params));
    };

    it("validates the user's email address", async () => {
      const response = await validateEmailAddress();

      expect(response).toHaveStatus(307);
      expect(response).toHaveHeader('Location', 'http://app.url/?validate-email=success');

      expect(commandBus.execute).toHaveBeenCalledWith(
        new ValidateEmailAddressCommand(params.userId, params.token),
        ctx,
      );
    });

    it('handles EmailValidationFailed errors', async () => {
      commandBus.execute = mockReject(
        new EmailValidationFailed(EmailValidationFailedReason.alreadyValidated),
      );

      const response = await expect.rejects(validateEmailAddress()).with(expect.anything());

      expect(response).toHaveStatus(307);
      expect(response).toHaveHeader('Location', 'http://app.url/?validate-email=already-validated');
    });
  });

  describe('requestLoginEmail', () => {
    it('throws a NotImplemented error', async () => {
      await expect.rejects(controller.requestLoginEmail()).with(NotImplemented);
    });
  });

  describe('logout', () => {
    const user = create.user();

    beforeEach(() => {
      session.user = user;
    });

    const logout = async () => {
      return controller.logout(new MockRequest());
    };

    it('executes a SignOutCommand', async () => {
      await logout();

      expect(commandBus.execute).toHaveBeenCalledWith(new SignOutCommand(), ExecutionContext.as(user));
    });

    it("clears the user's current session", async () => {
      const response = await logout();

      expect(response).toHaveStatus(204);
      expect(session.user).toBe(undefined);
    });

    it('fails to log out when the user is not authenticated', async () => {
      session.reset();

      await expect.rejects(logout()).with(AuthorizationError);
    });
  });

  describe('getAuthenticatedUser', () => {
    const getAuthenticatedUser = async () => {
      return controller.getAuthenticatedUser(new MockRequest());
    };

    it('returns no content when no user is authenticated', async () => {
      const response = await getAuthenticatedUser();

      expect(response).toHaveStatus(204);
    });

    it('returns the authenticated user', async () => {
      const user = create.user();

      session.user = user;

      const response = await getAuthenticatedUser();

      expect(response).toHaveStatus(200);
      expect(response).toHaveBody(expect.objectWithId(user.id));
    });
  });
});
