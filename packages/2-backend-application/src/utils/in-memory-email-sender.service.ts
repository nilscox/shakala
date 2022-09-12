import { last } from 'shared';

import { Email, EmailSenderService } from '../interfaces/email-sender.service';

export class InMemoryEmailSenderService implements EmailSenderService {
  private sentEmails: Email[] = [];

  async send(email: Email): Promise<void> {
    this.sentEmails.push(email);
  }

  get lastSentEmail() {
    return last(this.sentEmails);
  }
}
