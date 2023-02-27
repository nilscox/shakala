import { beforeEach, describe, it } from 'node:test';

import expect from '@nilscox/expect';
import { StubCryptoAdapter } from '@shakala/common';

import { create } from '../../factories';
import { InMemoryUserRepository } from '../../repositories/in-memory-user.repository';

import {
  CheckUserPasswordCommand,
  CheckUserPasswordHandler,
  InvalidCredentialsError,
} from './check-user-password';

describe('checkUserPassword', () => {
  let crypto: StubCryptoAdapter;
  let userRepository: InMemoryUserRepository;
  let handler: CheckUserPasswordHandler;

  beforeEach(() => {
    crypto = new StubCryptoAdapter();
    userRepository = new InMemoryUserRepository();
    handler = new CheckUserPasswordHandler(crypto, userRepository);
  });

  it("asserts that an input matches the user's password", async () => {
    const user = create.user({
      email: 'email',
      hashedPassword: await crypto.hash('password'),
    });

    userRepository.add(user);

    const command: CheckUserPasswordCommand = {
      email: 'email',
      password: 'password',
    };

    await expect(handler.handle(command)).toResolve();
  });

  it('throws an error when the user does not exist', async () => {
    const command: CheckUserPasswordCommand = {
      email: 'email',
      password: 'password',
    };

    await expect(handler.handle(command)).toRejectWith(InvalidCredentialsError);
  });

  it('throws an error when the password does not match', async () => {
    const user = create.user({
      email: 'email',
      hashedPassword: await crypto.hash('password'),
    });

    userRepository.add(user);

    const command: CheckUserPasswordCommand = {
      email: 'email',
      password: 'banana',
    };

    await expect(handler.handle(command)).toRejectWith(InvalidCredentialsError);
  });
});
