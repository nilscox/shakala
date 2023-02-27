import { AssertionError } from 'assert';

import { AppConfig, EntityNotFoundError, expect, stub, StubConfigAdapter, StubOf } from '@shakala/common';
import { EmailKind, SendEmailHandler } from '@shakala/email';
import { beforeEach, describe, it } from 'vitest';

import { UserCreatedEvent } from '../../commands/create-user/create-user';
import { create } from '../../factories';
import { InMemoryUserRepository } from '../../repositories/in-memory-user.repository';

import { SendEmailToCreatedUserHandler } from './send-email-to-created-user';

describe('SendEmailToCreatedUserHandler', () => {
  let config: StubConfigAdapter;
  let userRepository: InMemoryUserRepository;

  // todo: command bus
  let sendEmail: StubOf<SendEmailHandler['handle']>;
  let sendEmailHandler: SendEmailHandler;

  let handler: SendEmailToCreatedUserHandler;

  beforeEach(() => {
    const app: Partial<AppConfig> = {
      apiBaseUrl: 'https://api.url',
      appBaseUrl: 'https://app.url',
    };

    config = new StubConfigAdapter({ app });
    userRepository = new InMemoryUserRepository();
    sendEmail = stub<SendEmailHandler['handle']>();
    sendEmailHandler = { handle: sendEmail } as never;
    handler = new SendEmailToCreatedUserHandler(config, userRepository, sendEmailHandler);
  });

  it('triggers the SendEmail command handler', async () => {
    userRepository.add(
      create.user({
        id: 'userId',
        email: 'mano@domain.tld',
        nick: create.nick('mano'),
        emailValidationToken: 'token',
      })
    );

    await handler.handle(new UserCreatedEvent('userId'));

    expect(sendEmail).calledWith({
      kind: EmailKind.welcome,
      to: 'mano@domain.tld',
      payload: {
        appBaseUrl: 'https://app.url',
        emailValidationLink: 'https://api.url/user/validate-email/token',
        nick: 'mano',
      },
    });
  });

  it('fails when the user does not exist', async () => {
    await expect(handler.handle(new UserCreatedEvent('userId'))).toRejectWith(EntityNotFoundError);
  });

  it('fails when the user has no email validation token', async () => {
    userRepository.add(
      create.user({
        id: 'userId',
        emailValidationToken: undefined,
      })
    );

    const error = await expect(handler.handle(new UserCreatedEvent('userId'))).toRejectWith(AssertionError);

    expect(error.message).toEqual('user has no email validation token');
  });
});
