import { Email, EmailSenderService } from 'backend-application';
import { createTransport } from 'nodemailer';
import { pick } from 'shared';

export class NodeMailerEmailSenderService implements EmailSenderService {
  async send(email: Email): Promise<void> {
    const transport = createTransport({
      host: 'localhost',
      port: 1025,
      secure: false,
      auth: {
        user: 'hello@shakala.fr',
        pass: '',
      },
      ignoreTLS: true,
    });

    await transport.sendMail({
      ...pick(email, 'from', 'to', 'subject'),
      ...email.body,
    });
  }
}
