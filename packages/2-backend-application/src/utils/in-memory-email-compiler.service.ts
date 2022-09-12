import { EmailCompilerService, EmailPayload, EmailRenderer } from '../interfaces/email-compiler.service';

export class InMemoryEmailCompilerService implements EmailCompilerService {
  private replace(template: string, payload: EmailPayload) {
    return template.replace(/\{([a-zA-Z]+)\}/, (_, value) => payload[value] ?? '');
  }

  compile(templateText: string, templateHtml: string): EmailRenderer {
    return (payload: EmailPayload) => ({
      html: this.replace(templateHtml, payload),
      text: this.replace(templateText, payload),
    });
  }
}
