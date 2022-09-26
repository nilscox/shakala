import { last } from 'shared';

import { Email, EmailSenderPort } from '../interfaces';

export class InMemoryEmailSenderAdapter implements EmailSenderPort {
  private sentEmails: Email[] = [];

  async send(email: Email): Promise<void> {
    this.sentEmails.push(email);
  }

  get lastSentEmail() {
    return last(this.sentEmails);
  }
}
