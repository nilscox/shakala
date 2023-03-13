import {
  expect,
  StubCryptoAdapter,
  StubDateAdapter,
  StubEventPublisher,
  StubGeneratorAdapter,
  Timestamp,
} from '@shakala/common';
import { beforeEach, describe, it } from 'vitest';

import { create } from '../../factories';
import { InMemoryUserRepository } from '../../repositories/user/in-memory-user.repository';

import { CreateUserCommand, CreateUserHandler, UserCreatedEvent } from './create-user';

describe('[unit] CreateUser', () => {
  let test: Test;

  beforeEach(() => {
    test = new Test();
  });

  it('creates a new user', async () => {
    test.generator.nextToken = 'token';

    await expect(test.act()).toResolve();

    const user = test.user;

    expect(user).toBeDefined();
    expect(user).toHaveProperty('id', 'id');
    expect(user).toHaveProperty('nick', create.nick('nick'));
    expect(user).toHaveProperty('email', 'email');
    expect(user).toHaveProperty('hashedPassword', '#password#');
    expect(user).toHaveProperty('emailValidationToken', 'token');
  });

  it('publishes a UserCreatedEvent', async () => {
    await expect(test.act()).toResolve();

    expect(test.publisher).toHavePublished(new UserCreatedEvent('id'));
  });
});

class Test {
  now = new Timestamp('2022-01-01');

  generator = new StubGeneratorAdapter();
  dateAdapter = new StubDateAdapter(this.now);
  crypto = new StubCryptoAdapter();
  publisher = new StubEventPublisher();
  userRepository = new InMemoryUserRepository();

  handler = new CreateUserHandler(
    this.generator,
    this.dateAdapter,
    this.crypto,
    this.publisher,
    this.userRepository
  );

  get user() {
    return this.userRepository.get('id');
  }

  static readonly defaultCommand: CreateUserCommand = {
    userId: 'id',
    nick: 'nick',
    email: 'email',
    password: 'password',
  };

  act(overrides?: Partial<CreateUserCommand>) {
    return this.handler.handle({ ...Test.defaultCommand, ...overrides });
  }
}
