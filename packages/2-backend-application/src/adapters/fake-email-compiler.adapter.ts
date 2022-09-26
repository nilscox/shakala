import { EmailCompilerPort, EmailPayload, EmailRenderer } from '../interfaces';

export class FakeEmailCompilerAdapter implements EmailCompilerPort {
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
