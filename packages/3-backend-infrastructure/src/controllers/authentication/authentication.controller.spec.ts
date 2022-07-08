import {
  createUser,
  EmailAlreadyExistsError,
  GetUserByEmailQuery,
  InvalidCredentialsError,
  LoginCommand,
  NickAlreadyExistsError,
  SignupCommand,
} from 'backend-application';
import { get, LoginDto, SignupDto } from 'shared';

import {
  Forbidden,
  HttpError,
  NotImplemented,
  Request,
  ValidationError,
  ValidationService,
} from '../../infrastructure';
import { StubSessionService, MockCommandBus, MockQueryBus, MockRequest } from '../../test';

import { AuthenticationController } from './authentication.controller';

describe('AuthenticationController', () => {
  const sessionService = new StubSessionService();
  const queryBus = new MockQueryBus();
  const commandBus = new MockCommandBus();

  const controller = new AuthenticationController(
    new ValidationService(),
    sessionService,
    queryBus,
    commandBus,
  );

  describe('login', () => {
    const body: LoginDto = { email: 'user@email.tld', password: 'p4ssw0rd' };
    const user = createUser();

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
        nick: user.nick.value,
        email: user.email,
        profileImage: undefined,
        signupDate: user.signupDate.value,
      });

      expect(commandBus.execute).toHaveBeenCalledWith(new LoginCommand(body.email, body.password));
      expect(sessionService.user).toEqual(user);
    });

    it('fails to log in when the body is invalid', async () => {
      await expect(login(new MockRequest().withBody({}))).rejects.toThrow(ValidationError);
    });

    it('fails to log in when the user is already authenticated', async () => {
      sessionService.user = createUser();

      await expect(login()).rejects.test((error: HttpError) => {
        expect(error).toBeInstanceOf(Forbidden);
        expect(error).toHaveProperty('body.message', 'AlreadyAuthenticated');
      });
    });

    it('handles InvalidCredentials errors', async () => {
      commandBus.execute.mockRejectedValueOnce(new InvalidCredentialsError());

      await expect(login()).rejects.test((error) => {
        expect(error).toBeInstanceOf(Forbidden);
        expect(error).toHaveProperty('body.message', 'InvalidCredentials');
      });
    });
  });

  describe('signup', () => {
    const body: SignupDto = { nick: 'nick', email: 'user@domain.tld', password: 'p4ssw0rd' };
    const user = createUser();

    beforeEach(() => {
      queryBus.for(GetUserByEmailQuery).return(user);
    });

    const signup = async (req?: Request) => {
      return controller.signup(req ?? new MockRequest().withBody(body));
    };

    it('signs up in as a new user', async () => {
      const response = await signup();

      expect(response).toHaveStatus(201);
      expect(response).toHaveBody(expect.objectContaining({ id: user.id }));

      expect(commandBus.execute).toHaveBeenCalledWith(
        new SignupCommand(body.nick, body.email, body.password),
      );

      expect(sessionService.user).toEqual(user);
    });

    it('fails to sign up when the body is invalid', async () => {
      await expect(signup(new MockRequest().withBody({}))).rejects.toThrow(ValidationError);
    });

    it('fails to sign up when the user is already authenticated', async () => {
      sessionService.user = createUser();

      await expect(signup()).rejects.test((error: HttpError) => {
        expect(error).toBeInstanceOf(Forbidden);
        expect(error).toHaveProperty('body.message', 'AlreadyAuthenticated');
      });
    });

    it('handles EmailAlreadyExists errors', async () => {
      commandBus.execute.mockRejectedValueOnce(new EmailAlreadyExistsError(body.email));

      await expect(signup()).rejects.test((error) => {
        expect(error).toBeInstanceOf(ValidationError);
        expect(get(error, 'body', 'details', 'fields', '0')).toEqual({
          field: 'email',
          error: 'EmailAlreadyExists',
          value: body.email,
        });
      });
    });

    it('handles NickAlreadyExists errors', async () => {
      commandBus.execute.mockRejectedValueOnce(new NickAlreadyExistsError(body.nick));

      await expect(signup()).rejects.test((error) => {
        expect(error).toBeInstanceOf(ValidationError);
        expect(get(error, 'body', 'details', 'fields', '0')).toEqual({
          field: 'nick',
          error: 'NickAlreadyExists',
          value: body.nick,
        });
      });
    });
  });

  describe('requestLoginEmail', () => {
    it('throws a NotImplemented error', async () => {
      await expect(controller.requestLoginEmail()).rejects.toThrow(NotImplemented);
    });
  });

  describe('logout', () => {
    beforeEach(() => {
      sessionService.user = createUser();
    });

    const logout = async () => {
      return controller.logout(new MockRequest());
    };

    it("clears the user's current session", async () => {
      const response = await logout();

      expect(response).toHaveStatus(204);
      expect(sessionService.user).toBeUndefined();
    });

    it('fails to log out when the user is not authenticated', async () => {
      sessionService.reset();

      await expect(logout()).rejects.toThrow(Forbidden);
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
      const user = createUser();

      sessionService.user = user;

      const response = await getAuthenticatedUser();

      expect(response).toHaveStatus(200);
      expect(response).toHaveBody(expect.objectContaining({ id: user.id }));
    });
  });
});