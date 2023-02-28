import { EntityNotFoundError, expect, StubEventPublisher } from '@shakala/common';
import { beforeEach, describe, it } from 'vitest';

import { create } from '../../factories';
import { InMemoryUserRepository } from '../../repositories/in-memory-user.repository';

import {
  EmailAlreadyValidatedError,
  InvalidEmailValidationTokenError,
  UserEmailValidatedEvent,
  ValidateUserEmailCommand,
  ValidateUserEmailHandler,
} from './validate-user-email';

describe('[unit] ValidateUserEmail', () => {
  let publisher: StubEventPublisher;
  let userRepository: InMemoryUserRepository;
  let handler: ValidateUserEmailHandler;

  beforeEach(() => {
    publisher = new StubEventPublisher();
    userRepository = new InMemoryUserRepository();
    handler = new ValidateUserEmailHandler(publisher, userRepository);
  });

  it("validates a user's email", async () => {
    const command: ValidateUserEmailCommand = {
      userId: 'userId',
      emailValidationToken: 'token',
    };

    userRepository.add(create.user({ id: 'userId', emailValidationToken: 'token' }));

    await expect(handler.handle(command)).toResolve();

    expect(userRepository.get('userId')).toHaveProperty('emailValidationToken', undefined);
  });

  it('publishes a UserEmailValidatedEvent', async () => {
    const command: ValidateUserEmailCommand = {
      userId: 'userId',
      emailValidationToken: 'token',
    };

    userRepository.add(create.user({ id: 'userId', emailValidationToken: 'token' }));

    await expect(handler.handle(command)).toResolve();

    expect(publisher).toHavePublished(new UserEmailValidatedEvent('userId'));
  });

  it("throws a EmailAlreadyValidatedError when user's email was already validated", async () => {
    const command: ValidateUserEmailCommand = {
      userId: 'userId',
      emailValidationToken: 'token',
    };

    userRepository.add(create.user({ id: 'userId' }));

    await expect(handler.handle(command)).toRejectWith(EmailAlreadyValidatedError);
  });

  it('throws a InvalidEmailValidationTokenError when the token is not valid', async () => {
    const command: ValidateUserEmailCommand = {
      userId: 'userId',
      emailValidationToken: 'token',
    };

    userRepository.add(create.user({ id: 'userId', emailValidationToken: 'not-the-token' }));

    await expect(handler.handle(command)).toRejectWith(InvalidEmailValidationTokenError);
  });

  it('fails when the user does not exist', async () => {
    const command: ValidateUserEmailCommand = {
      userId: 'userId',
      emailValidationToken: 'token',
    };

    await expect(handler.handle(command)).toRejectWith(EntityNotFoundError);
  });
});
