import { token } from 'brandi';

import { SendEmailHandler } from './commands/send-email/send-email.command';
import { EmailCompilerPort } from './ports/email-compiler/email-compiler.port';
import { EmailSenderPort } from './ports/email-sender/email-sender.port';

export const EMAIL_TOKENS = {
  emailCompiler: token<EmailCompilerPort>('emailCompiler'),
  emailSender: token<EmailSenderPort>('emailSender'),
  sendEmailHandler: token<SendEmailHandler>('sendEmailHandler'),
};
