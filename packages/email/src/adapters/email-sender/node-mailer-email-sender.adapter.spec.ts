import expect from '@nilscox/expect';
import { EmailConfig, StubConfigAdapter } from '@shakala/common';
import { stub } from '@shakala/shared';
import { describe, it } from 'vitest';

import { NodeMailerEmailSenderAdapter } from './node-mailer-email-sender.adapter';

describe('[unit] NodeMailerEmailSenderAdapter', () => {
  it('sends an email', async () => {
    const emailConfig: EmailConfig = {
      host: 'host',
      port: 2525,
      secure: true,
      user: 'hello@domain.fr',
      password: 'password',
      from: 'Someone',
      templatesPath: '',
    };

    const sendMail = stub();

    const config = new StubConfigAdapter({ email: emailConfig });
    const emailSender = new NodeMailerEmailSenderAdapter(config);

    emailSender.createTransport = () => ({ sendMail } as never);

    await emailSender.send({
      to: 'you',
      subject: 'hello',
      body: {
        text: 'how are you?',
        html: '<p>how are you?</p>',
      },
    });

    expect(sendMail).calledWith({
      from: 'Someone <hello@domain.fr>',
      to: 'you',
      subject: 'hello',
      text: 'how are you?',
      html: '<p>how are you?</p>',
    });
  });
});
