import { expect, StubConfigAdapter, StubFilesystemAdapter } from '@shakala/common';
import { beforeEach, describe, it } from 'vitest';

import { Email } from '../../entities/email';
import { FakeEmailCompilerAdapter } from '../../ports/email-compiler/fake-email-compiler.adapter';
import { StubEmailSenderAdapter } from '../../ports/email-sender/stub-email-sender.adapter';

import { EmailKind, SendEmailCommand, SendEmailHandler } from './send-email.command';

describe('[unit] SendEmailCommand', () => {
  let emailCompiler: FakeEmailCompilerAdapter;
  let emailSender: StubEmailSenderAdapter;
  let handler: SendEmailHandler;

  beforeEach(async () => {
    const fs = {
      '/templates/welcome.txt': 'Welcome {nick}',
      '/templates/welcome.mjml': '<p>Welcome {nick}</p>',
    };

    emailCompiler = new FakeEmailCompilerAdapter();
    emailSender = new StubEmailSenderAdapter();

    handler = new SendEmailHandler(
      new StubConfigAdapter({ email: { templatesPath: '/templates' } }),
      new StubFilesystemAdapter(fs),
      emailCompiler,
      emailSender
    );

    await handler.init();
  });

  it('sends a welcome email to a user', async () => {
    const command: SendEmailCommand<EmailKind.welcome> = {
      kind: EmailKind.welcome,
      to: 'user@domain.tld',
      payload: {
        appBaseUrl: 'https://app.url',
        nick: 'tamer',
        emailValidationLink: '',
      },
    };

    await handler.handle(command);

    const expected: Email = {
      to: 'user@domain.tld',
      subject: 'Bienvenue sur Shakala !',
      body: {
        text: 'Welcome tamer',
        html: '<p>Welcome tamer</p>',
      },
    };

    expect(emailSender.lastSentEmail).toEqual(expected);
  });
});
