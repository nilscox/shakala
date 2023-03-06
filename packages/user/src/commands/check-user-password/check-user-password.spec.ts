import expect from '@nilscox/expect';
import { StubCryptoAdapter } from '@shakala/common';
import { beforeEach, describe, it } from 'vitest';

import { create } from '../../factories';
import { InMemoryUserRepository } from '../../repositories/in-memory-user.repository';

import {
  CheckUserPasswordCommand,
  CheckUserPasswordHandler,
  InvalidCredentialsError,
} from './check-user-password';

describe('[unit] CheckUserPassword', () => {
  let test: Test;

  beforeEach(async () => {
    test = new Test();
    await test.arrange();
  });

  it("asserts that an input matches the user's password", async () => {
    await expect(test.act()).toResolve();
  });

  it('throws an error when the user does not exist', async () => {
    await expect(test.act({ email: 'nope' })).toRejectWith(InvalidCredentialsError);
  });

  it('throws an error when the password does not match', async () => {
    await expect(test.act({ password: 'banana' })).toRejectWith(InvalidCredentialsError);
  });
});

class Test {
  crypto = new StubCryptoAdapter();
  userRepository = new InMemoryUserRepository();

  handler = new CheckUserPasswordHandler(this.crypto, this.userRepository);

  get user() {
    return this.userRepository.get('id');
  }

  async arrange() {
    const user = create.user({
      email: 'email',
      hashedPassword: await this.crypto.hash('password'),
    });

    this.userRepository.add(user);
  }

  static readonly defaultCommand: CheckUserPasswordCommand = {
    email: 'email',
    password: 'password',
  };

  act(overrides?: Partial<CheckUserPasswordCommand>) {
    return this.handler.handle({ ...Test.defaultCommand, ...overrides });
  }
}
