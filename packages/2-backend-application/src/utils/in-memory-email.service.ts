import { last } from 'shared';

import { Email, EmailPayload, EmailRenderer, EmailService } from '../interfaces/email.service';

export class InMemoryEmailService implements EmailService {
  private replace(template: string, payload: EmailPayload) {
    return template.replace(/\{([a-zA-Z]+)\}/, (_, value) => payload[value] ?? '');
  }

  compile(templateText: string, templateHtml: string): EmailRenderer {
    return (payload: EmailPayload) => ({
      html: this.replace(templateHtml, payload),
      text: this.replace(templateText, payload),
    });
  }

  private sentEmails: Email[] = [];

  async send(email: Email): Promise<void> {
    this.sentEmails.push(email);
  }

  get lastSentEmail() {
    return last(this.sentEmails);
  }
}
