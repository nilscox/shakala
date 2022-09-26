import { EmailBody } from './email-compiler.port';

export type Email = {
  to: string;
  subject: string;
  body: EmailBody;
};

export interface EmailSenderPort {
  send(email: Email): Promise<void>;
}
