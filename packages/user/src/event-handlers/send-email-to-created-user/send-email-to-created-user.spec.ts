import { AssertionError } from 'assert';

import { EntityNotFoundError, expect, StubCommandBus, StubConfigAdapter } from '@shakala/common';
import { EmailKind, sendEmail } from '@shakala/email';
import { beforeEach, describe, it } from 'vitest';

import { UserCreatedEvent } from '../../commands/create-user/create-user';
import { create } from '../../factories';
import { InMemoryUserRepository } from '../../repositories/user/in-memory-user.repository';

import { SendEmailToCreatedUserHandler } from './send-email-to-created-user';

describe('[unit] SendEmailToCreatedUserHandler', () => {
  let test: Test;

  beforeEach(() => {
    test = new Test();
    test.arrange();
  });

  it('triggers the SendEmail command handler', async () => {
    await expect(test.act()).toResolve();

    expect(test.commandBus).toInclude(
      sendEmail({
        kind: EmailKind.welcome,
        to: 'mano@domain.tld',
        payload: {
          appBaseUrl: 'https://app.url',
          emailValidationLink: 'https://api.url/user/validate-email/token',
          nick: 'mano',
        },
      })
    );
  });

  it('fails when the user does not exist', async () => {
    await expect(test.act('notUserId')).toRejectWith(EntityNotFoundError);
  });

  it('fails when the user has no email validation token', async () => {
    test.userRepository.add(
      create.user({
        id: 'userId',
        emailValidationToken: undefined,
      })
    );

    const error = await expect(test.act()).toRejectWith(AssertionError);

    expect(error.message).toEqual('user has no email validation token');
  });
});

class Test {
  config = new StubConfigAdapter({
    app: {
      apiBaseUrl: 'https://api.url',
      appBaseUrl: 'https://app.url',
    },
  });

  userRepository = new InMemoryUserRepository();
  commandBus = new StubCommandBus();

  handler = new SendEmailToCreatedUserHandler(this.config, this.commandBus, this.userRepository);

  arrange() {
    const user = create.user({
      id: 'userId',
      email: 'mano@domain.tld',
      nick: create.nick('mano'),
      emailValidationToken: 'token',
    });

    this.userRepository.add(user);
  }

  async act(userId = 'userId') {
    await this.handler.handle(new UserCreatedEvent(userId));
  }
}
