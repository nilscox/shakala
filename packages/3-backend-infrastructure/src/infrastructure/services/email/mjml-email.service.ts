import path from 'path';

import {
  Email,
  EmailPayload,
  EmailRenderer,
  EmailService,
} from 'backend-application/src/interfaces/email.service';
import Handlebars from 'handlebars';
import mjml2html from 'mjml';
import { createTransport } from 'nodemailer';
import { pick } from 'shared';

export class MjmlEmailService implements EmailService {
  compile(templateText: string, templateHtml: string): EmailRenderer {
    const { html, errors } = mjml2html(templateHtml, {
      fonts: {
        Montserrat: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700',
      },
      minify: false,
      validationLevel: 'strict',
      filePath:
        '/' +
        path.join(
          'home',
          'nils',
          'dev',
          'shakala',
          'packages',
          '2-backend-application',
          'src',
          'modules',
          'email',
          'templates',
        ),
    });

    if (errors.length) {
      console.error(errors);
      throw new Error(`failed to render template "${templateHtml}"`);
    }

    const renderHtml = Handlebars.compile(html);
    const renderText = Handlebars.compile(templateText);

    return (payload: EmailPayload) => ({
      html: renderHtml(payload),
      text: renderText(payload),
    });
  }

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
