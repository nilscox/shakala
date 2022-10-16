import {
  factories,
  InvalidCredentials,
  StubDateAdapter,
  UserAuthenticatedEvent,
  UserAuthenticationFailedEvent,
} from 'backend-domain';
import { AuthenticationMethod } from 'shared';

import { InMemoryUserRepository, StubEventBus } from '../../../adapters';
import { ExecutionContext } from '../../../utils';

import { LoginCommand, LoginCommandHandler } from './login.command';

describe('LoginCommand', () => {
  const eventBus = new StubEventBus();
  const userRepository = new InMemoryUserRepository();
  const dateAdapter = new StubDateAdapter();

  const handler = new LoginCommandHandler(eventBus, userRepository);

  const create = factories({ date: dateAdapter });

  const email = 'user@domain.tld';
  const password = 'p4ssw0rd';

  const userId = 'userId';
  const user = create.user({ id: userId, email, hashedPassword: '#' + password });

  const now = create.timestamp('2022-01-01');

  beforeEach(() => {
    dateAdapter.setNow(now);
    userRepository.add(user);
  });

  const login = (command?: LoginCommand) => {
    return handler.handle(command ?? new LoginCommand(email, password), ExecutionContext.unauthenticated);
  };

  it('logs in as an existing user', async () => {
    expect(await login()).toBeUndefined();
  });

  it('updates the last login date', async () => {
    await login();

    expect(userRepository.get(userId)).toHaveProperty('lastLoginDate', now);
  });

  it('emits a UserAuthenticatedEvent', async () => {
    await login();

    expect(eventBus).toHaveEmitted(new UserAuthenticatedEvent(userId, AuthenticationMethod.emailPassword));
  });

  it('fails to log in when the user does not exist', async () => {
    await expect.rejects(login(new LoginCommand('nope@domain.tld', ''))).with(InvalidCredentials);
  });

  it('fails to log in when the password does not match', async () => {
    await expect.rejects(login(new LoginCommand(email, 'nope'))).with(InvalidCredentials);
  });

  it('emits a UserAuthenticationFailedEvent', async () => {
    await expect.rejects(login(new LoginCommand(email, 'nope'))).with(Error);

    expect(eventBus).toHaveEmitted(
      new UserAuthenticationFailedEvent(userId, AuthenticationMethod.emailPassword),
    );
  });
});
