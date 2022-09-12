import { Email, EmailSenderService } from 'backend-application';
import { createTransport } from 'nodemailer';
import { pick } from 'shared';

import { ConfigService } from '../config/config.service';

export class NodeMailerEmailSenderService implements EmailSenderService {
  constructor(private readonly configService: ConfigService) {}

  async send(email: Email): Promise<void> {
    const { host, port, secure, user, password, from } = this.configService.email();

    const transport = createTransport({
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
