import { ConfigPort, TOKENS } from '@shakala/common';
import { pick } from '@shakala/shared';
import { injected } from 'brandi';
import * as nodeMailer from 'nodemailer';

import { Email } from '../../entities/email';

import { EmailSenderPort } from './email-sender.port';

export class NodeMailerEmailSenderAdapter implements EmailSenderPort {
  createTransport = nodeMailer.createTransport;

  constructor(private readonly config: ConfigPort) {}

  async send(email: Email): Promise<void> {
    const { host, port, secure, user, password, from } = this.config.email;

    const transport = this.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass: password,
      },
      ignoreTLS: !secure,
    });

    await transport.sendMail({
      from: `${from} <${user}>`,
      ...pick(email, 'to', 'subject'),
      ...email.body,
    });
  }
}

injected(NodeMailerEmailSenderAdapter, TOKENS.config);
