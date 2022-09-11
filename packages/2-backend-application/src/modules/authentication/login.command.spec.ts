import { factories, InvalidCredentialsError, StubDateService } from 'backend-domain';

import { InMemoryUserRepository } from '../user/user.in-memory-repository';

import { LoginCommand, LoginCommandHandler } from './login.command';

describe('LoginCommand', () => {
  const userRepository = new InMemoryUserRepository();
  const dateService = new StubDateService();

  const handler = new LoginCommandHandler(userRepository);

  const create = factories({ dateService });

  const email = 'user@domain.tld';
  const password = 'p4ssw0rd';

  const userId = 'userId';
  const user = create.user({ id: userId, email, hashedPassword: '#' + password });

  const now = create.timestamp('2022-01-01');

  beforeEach(() => {
    dateService.setNow(now);
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
    await expect(login(new LoginCommand('nope@domain.tld', ''))).rejects.toThrow(InvalidCredentialsError);
  });

  it('fails to log in when the password does not match', async () => {
    await expect(login(new LoginCommand(email, 'nope'))).rejects.toThrow(InvalidCredentialsError);
  });
});
