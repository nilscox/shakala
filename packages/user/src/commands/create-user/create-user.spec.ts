import { beforeEach, describe, it } from 'node:test';

import {
  CommandHandlerCommand,
  CommandHandlerDependencies,
  expect,
  StubCryptoAdapter,
  StubEventPublisher,
} from '@shakala/common';

import { create } from '../../factories';
import { InMemoryUserRepository } from '../../repositories/in-memory-user.repository';

import { createUser, UserCreatedEvent } from './create-user';

type Command = CommandHandlerCommand<typeof createUser>;

describe('createUser', () => {
  let crypto: StubCryptoAdapter;
  let publisher: StubEventPublisher;
  let userRepository: InMemoryUserRepository;
  let deps: CommandHandlerDependencies<typeof createUser>;

  beforeEach(() => {
    crypto = new StubCryptoAdapter();
    publisher = new StubEventPublisher();
    userRepository = new InMemoryUserRepository();
    deps = { userRepository, publisher, crypto };
  });

  it('creates a new user', async () => {
    const command: Command = {
      id: 'id',
      nick: 'nils',
      email: 'email',
      password: 'password',
    };

    await expect(createUser(deps, command)).toResolve();

    const user = userRepository.get('id');

    expect(user).toBeDefined();
    expect(user).toHaveProperty('id', 'id');
    expect(user).toHaveProperty('nick', create.nick('nils'));
    expect(user).toHaveProperty('email', 'email');
    expect(user).toHaveProperty('hashedPassword', '#password#');
  });

  it('publishes a UserCreatedEvent', async () => {
    const command: Command = {
      id: 'id',
      nick: 'nils',
      email: 'email',
      password: 'password',
    };

    await expect(createUser(deps, command)).toResolve();

    expect(publisher).toHavePublished(new UserCreatedEvent('id'));
  });
});
