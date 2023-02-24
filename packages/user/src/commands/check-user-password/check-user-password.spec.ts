import { beforeEach, describe, it } from 'node:test';

import expect from '@nilscox/expect';
import { CommandHandlerCommand, CommandHandlerDependencies, StubCryptoAdapter } from '@shakala/common';

import { create } from '../../factories';
import { InMemoryUserRepository } from '../../repositories/in-memory-user.repository';

import { checkUserPassword, InvalidCredentialsError } from './check-user-password';

type Command = CommandHandlerCommand<typeof checkUserPassword>;

describe('checkUserPassword', () => {
  let crypto: StubCryptoAdapter;
  let userRepository: InMemoryUserRepository;
  let deps: CommandHandlerDependencies<typeof checkUserPassword>;

  beforeEach(() => {
    crypto = new StubCryptoAdapter();
    userRepository = new InMemoryUserRepository();
    deps = { userRepository, crypto };
  });

  it("asserts that an input matches the user's password", async () => {
    const user = create.user({
      email: 'email',
      hashedPassword: await crypto.hash('password'),
    });

    userRepository.add(user);

    const command: Command = {
      email: 'email',
      password: 'password',
    };

    await expect(checkUserPassword(deps, command)).toResolve();
  });

  it('throws an error when the user does not exist', async () => {
    const command: Command = {
      email: 'email',
      password: 'password',
    };

    await expect(checkUserPassword(deps, command)).toRejectWith(InvalidCredentialsError);
  });

  it('throws an error when the password does not match', async () => {
    const user = create.user({
      email: 'email',
      hashedPassword: await crypto.hash('password'),
    });

    userRepository.add(user);

    const command: Command = {
      email: 'email',
      password: 'banana',
    };

    await expect(checkUserPassword(deps, command)).toRejectWith(InvalidCredentialsError);
  });
});
