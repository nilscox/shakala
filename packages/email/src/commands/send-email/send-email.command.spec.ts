import { expect, StubConfigAdapter, StubFilesystemAdapter } from '@shakala/common';
import { beforeEach, describe, it } from 'vitest';

import { FakeEmailCompilerAdapter } from '../../adapters/email-compiler/fake-email-compiler.adapter';
import { StubEmailSenderAdapter } from '../../adapters/email-sender/stub-email-sender.adapter';
import { Email } from '../../entities/email';

import { EmailKind, SendEmailCommand, SendEmailHandler } from './send-email.command';

describe('[unit] SendEmailCommand', () => {
  let test: Test;

  beforeEach(async () => {
    test = new Test();
    await test.arrange();
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

    await expect(test.act(command)).toResolve();

    const expected: Email = {
      to: 'user@domain.tld',
      subject: 'Bienvenue sur Shakala !',
      body: {
        text: 'Welcome tamer',
        html: '<p>Welcome tamer</p>',
      },
    };

    expect(test.emailSender.lastSentEmail).toEqual(expected);
  });
});

class Test {
  fs = {
    '/templates/welcome.txt': 'Welcome {nick}',
    '/templates/welcome.mjml': '<p>Welcome {nick}</p>',
  };

  emailCompiler = new FakeEmailCompilerAdapter();
  emailSender = new StubEmailSenderAdapter();

  handler = new SendEmailHandler(
    new StubConfigAdapter({ email: { templatesPath: '/templates' } }),
    new StubFilesystemAdapter(this.fs),
    this.emailCompiler,
    this.emailSender
  );

  async arrange() {
    await this.handler.init();
  }

  act = this.handler.handle.bind(this.handler);
}
