import { EmailPayload, EmailRenderer } from '../../entities/email';

import { EmailCompilerPort } from './email-compiler.port';

export class FakeEmailCompilerAdapter implements EmailCompilerPort {
  compile(templateText: string, templateHtml: string): EmailRenderer {
    return (payload: EmailPayload) => ({
      html: this.replace(templateHtml, payload),
      text: this.replace(templateText, payload),
    });
  }

  private replace(template: string, payload: EmailPayload) {
    return template.replace(/\{([a-zA-Z]+)\}/, (_, value: string) => payload[value] ?? '');
  }
}
