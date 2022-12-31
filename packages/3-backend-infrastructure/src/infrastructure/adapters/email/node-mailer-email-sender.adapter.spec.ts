import { mockFn } from '@shakala/shared/test';
import { Transporter } from 'nodemailer';

import { EmailConfig } from '../config/config.port';
import { StubConfigAdapter } from '../config/stub-config.adapter';

import { NodeMailerEmailSenderAdapter } from './node-mailer-email-sender.adapter';

describe('NodeMailerEmailSenderAdapter', () => {
  const emailConfig: EmailConfig = {
    host: 'host',
    port: 2525,
    secure: true,
    user: 'hello@domain.fr',
    password: 'password',
    from: 'Someone',
  };

  const sendMail = mockFn();

  const mockCreateTransport = mockFn({
    sendMail,
  } as unknown as Transporter<unknown>);

  const config = new StubConfigAdapter({ email: emailConfig });
  const emailSender = new NodeMailerEmailSenderAdapter(config, mockCreateTransport);

  it('sends an email', async () => {
    await emailSender.send({
      to: 'you',
      subject: 'hello',
      body: {
        text: 'how are you?',
        html: '<p>how are you?</p>',
      },
    });

    expect(sendMail).toHaveBeenCalledWith({
      from: 'Someone <hello@domain.fr>',
      to: 'you',
      subject: 'hello',
      text: 'how are you?',
      html: '<p>how are you?</p>',
    });
  });
});
