import { Email } from '../../entities/email';

export interface EmailSenderPort {
  send(email: Email): Promise<void>;
}
