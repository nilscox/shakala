import path from 'path';

import { EmailCompilerService, EmailPayload, EmailRenderer } from 'backend-application';
import Handlebars from 'handlebars';
import mjml2html from 'mjml';

export class MjmlEmailCompilerService implements EmailCompilerService {
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
}
