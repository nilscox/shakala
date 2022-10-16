import { Email, EmailSenderPort } from 'backend-application';
import * as nodeMailer from 'nodemailer';
import { pick } from 'shared';

import { ConfigPort } from '../config/config.port';

export class NodeMailerEmailSenderAdapter implements EmailSenderPort {
  constructor(
    private readonly config: ConfigPort,
    private readonly createTransport = nodeMailer.createTransport,
  ) {}

  async send(email: Email): Promise<void> {
    const { host, port, secure, user, password, from } = this.config.email();

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
