import { EmailCompilerService, EmailPayload, EmailRenderer, FilesystemService } from 'backend-application';
import Handlebars from 'handlebars';
import mjml2html from 'mjml';

export class MjmlEmailCompilerService implements EmailCompilerService {
  constructor(private readonly filesystemService: FilesystemService) {}

  compile(templateText: string, templateHtml: string): EmailRenderer {
    const { html, errors } = mjml2html(templateHtml, {
      fonts: {
        Montserrat: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700',
      },
      minify: false,
      validationLevel: 'strict',
      filePath: this.filesystemService.emailTemplatesPath,
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
