import { last } from '@shakala/shared';
import { injected } from 'brandi';

import { Email } from '../../entities/email';

import { EmailSenderPort } from './email-sender.port';

export class StubEmailSenderAdapter implements EmailSenderPort {
  private sentEmails: Email[] = [];

  get lastSentEmail() {
    return last(this.sentEmails);
  }

  async send(email: Email): Promise<void> {
    this.sentEmails.push(email);
  }
}

injected(StubEmailSenderAdapter);
