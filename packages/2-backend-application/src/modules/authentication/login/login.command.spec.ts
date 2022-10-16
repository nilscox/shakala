import { factories, InvalidCredentials, StubDateAdapter } from 'backend-domain';

import { InMemoryUserRepository } from '../../../adapters';

import { LoginCommand, LoginCommandHandler } from './login.command';

describe('LoginCommand', () => {
  const userRepository = new InMemoryUserRepository();
  const dateAdapter = new StubDateAdapter();

  const handler = new LoginCommandHandler(userRepository);

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
    return handler.handle(command ?? new LoginCommand(email, password));
  };

  it('logs in as an existing user', async () => {
    expect(await login()).toBeUndefined();
  });

  it('updates the last login date', async () => {
    await login();

    expect(userRepository.get(userId)).toHaveProperty('lastLoginDate', now);
  });

  it('fails to log in when the user does not exist', async () => {
    await expect.rejects(login(new LoginCommand('nope@domain.tld', ''))).with(InvalidCredentials);
  });

  it('fails to log in when the password does not match', async () => {
    await expect.rejects(login(new LoginCommand(email, 'nope'))).with(InvalidCredentials);
  });
});
