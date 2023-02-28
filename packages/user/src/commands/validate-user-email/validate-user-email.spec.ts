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
  let test: Test;

  beforeEach(async () => {
    test = new Test();
    test.arrange();
  });

  it("validates a user's email", async () => {
    await expect(test.act()).toResolve();

    expect(test.user).toHaveProperty('emailValidationToken', undefined);
  });

  it('publishes a UserEmailValidatedEvent', async () => {
    await expect(test.act()).toResolve();

    expect(test.publisher).toHavePublished(new UserEmailValidatedEvent('userId'));
  });

  it("throws a EmailAlreadyValidatedError when user's email was already validated", async () => {
    test.userRepository.add(create.user({ id: 'userId' }));

    await expect(test.act()).toRejectWith(EmailAlreadyValidatedError);
  });

  it('throws a InvalidEmailValidationTokenError when the token is not valid', async () => {
    test.userRepository.add(create.user({ id: 'userId', emailValidationToken: 'not-the-token' }));

    await expect(test.act()).toRejectWith(InvalidEmailValidationTokenError);
  });

  it('fails when the user does not exist', async () => {
    await expect(test.act({ userId: 'anotherUserId' })).toRejectWith(EntityNotFoundError);
  });
});

class Test {
  publisher = new StubEventPublisher();
  userRepository = new InMemoryUserRepository();

  handler = new ValidateUserEmailHandler(this.publisher, this.userRepository);

  get user() {
    return this.userRepository.get('userId');
  }

  arrange() {
    const user = create.user({
      id: 'userId',
      emailValidationToken: 'token',
    });

    this.userRepository.add(user);
  }

  static readonly defaultCommand: ValidateUserEmailCommand = {
    userId: 'userId',
    emailValidationToken: 'token',
  };

  act(overrides?: Partial<ValidateUserEmailCommand>) {
    return this.handler.handle({ ...Test.defaultCommand, ...overrides });
  }
}
