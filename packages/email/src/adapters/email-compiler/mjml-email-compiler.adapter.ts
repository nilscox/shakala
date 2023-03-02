import { ConfigPort, TOKENS } from '@shakala/common';
import { injected } from 'brandi';
import Handlebars from 'handlebars';
import mjml2html from 'mjml';

import { EmailPayload, EmailRenderer } from '../../entities/email';

import { EmailCompilerPort } from './email-compiler.port';

export class MjmlEmailCompilerAdapter implements EmailCompilerPort {
  constructor(private readonly config: ConfigPort) {}

  compile(templateText: string, templateHtml: string): EmailRenderer {
    const { templatesPath } = this.config.email;

    const { html, errors } = mjml2html(templateHtml, {
      fonts: {
        Montserrat: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700',
      },
      minify: false,
      validationLevel: 'strict',
      filePath: templatesPath,
    });

    if (errors.length) {
      // todo: report error
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

injected(MjmlEmailCompilerAdapter, TOKENS.config);
