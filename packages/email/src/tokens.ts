import { token } from 'brandi';

import { EmailCompilerPort } from './adapters/email-compiler/email-compiler.port';
import { EmailSenderPort } from './adapters/email-sender/email-sender.port';
import { SendEmailHandler } from './commands/send-email/send-email.command';

export const EMAIL_TOKENS = {
  emailCompiler: token<EmailCompilerPort>('emailCompiler'),
  emailSender: token<EmailSenderPort>('emailSender'),
  sendEmailHandler: token<SendEmailHandler>('sendEmailHandler'),
};
