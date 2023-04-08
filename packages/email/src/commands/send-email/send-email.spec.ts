import expect from '@nilscox/expect';
import { beforeEach, describe, it } from 'vitest';

import { FakeEmailRendererAdapter } from '../../adapters/email-renderer/fake-email-renderer.adapter';
import { StubEmailSenderAdapter } from '../../adapters/email-sender/stub-email-sender.adapter';
import { Email } from '../../entities/email';
import { EmailKind } from '../../entities/emails-payloads';

import { SendEmailCommand, SendEmailHandler } from './send-email';

describe('[unit] SendEmailCommand', () => {
  let test: Test;

  beforeEach(() => {
    test = new Test();
  });

  it('sends a welcome email to a user', async () => {
    test.emailRenderer.text = 'text';
    test.emailRenderer.html = 'html';

    const command: SendEmailCommand<EmailKind.welcome> = {
      kind: EmailKind.welcome,
      to: 'user@domain.tld',
      payload: {
        appBaseUrl: '',
        nick: '',
        emailValidationLink: '',
      },
    };

    await expect(test.act(command)).toResolve();

    const expected: Email = {
      to: 'user@domain.tld',
      subject: 'Bienvenue sur Shakala !',
      body: {
        text: 'text',
        html: 'html',
      },
    };

    expect(test.emailSender.lastSentEmail).toEqual(expected);
  });
});

class Test {
  emailRenderer = new FakeEmailRendererAdapter();
  emailSender = new StubEmailSenderAdapter();

  handler = new SendEmailHandler(this.emailRenderer, this.emailSender);

  act = this.handler.handle.bind(this.handler);
}
