import { EmailBody } from './email-compiler.service';

export type Email = {
  to: string;
  subject: string;
  body: EmailBody;
};

export interface EmailSenderService {
  send(email: Email): Promise<void>;
}
