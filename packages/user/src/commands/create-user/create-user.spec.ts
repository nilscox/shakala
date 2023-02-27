import { expect, StubCryptoAdapter, StubEventPublisher, StubGeneratorAdapter } from '@shakala/common';
import { beforeEach, describe, it } from 'vitest';

import { create } from '../../factories';
import { InMemoryUserRepository } from '../../repositories/in-memory-user.repository';

import { CreateUserCommand, CreateUserHandler, UserCreatedEvent } from './create-user';

describe('createUser', () => {
  let generator: StubGeneratorAdapter;
  let crypto: StubCryptoAdapter;
  let publisher: StubEventPublisher;
  let userRepository: InMemoryUserRepository;
  let handler: CreateUserHandler;

  beforeEach(() => {
    generator = new StubGeneratorAdapter();
    crypto = new StubCryptoAdapter();
    publisher = new StubEventPublisher();
    userRepository = new InMemoryUserRepository();
    handler = new CreateUserHandler(generator, crypto, publisher, userRepository);
  });

  it('creates a new user', async () => {
    generator.nextToken = 'token';

    const command: CreateUserCommand = {
      id: 'id',
      nick: 'nils',
      email: 'email',
      password: 'password',
    };

    await expect(handler.handle(command)).toResolve();

    const user = userRepository.get('id');

    expect(user).toBeDefined();
    expect(user).toHaveProperty('id', 'id');
    expect(user).toHaveProperty('nick', create.nick('nils'));
    expect(user).toHaveProperty('email', 'email');
    expect(user).toHaveProperty('hashedPassword', '#password#');
    expect(user).toHaveProperty('emailValidationToken', 'token');
  });

  it('publishes a UserCreatedEvent', async () => {
    const command: CreateUserCommand = {
      id: 'id',
      nick: 'nils',
      email: 'email',
      password: 'password',
    };

    await expect(handler.handle(command)).toResolve();

    expect(publisher).toHavePublished(new UserCreatedEvent('id'));
  });
});
