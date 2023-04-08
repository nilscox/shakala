import { token } from 'brandi';

import { EmailCompilerPort } from './adapters/email-compiler/email-compiler.port';
import { EmailRendererPort } from './adapters/email-renderer/email-renderer.port';
import { EmailSenderPort } from './adapters/email-sender/email-sender.port';
import { SendEmailHandler } from './commands/send-email/send-email';

export const EMAIL_TOKENS = {
  adapters: {
    emailCompiler: token<EmailCompilerPort>('emailCompiler'),
    emailRenderer: token<EmailRendererPort>('emailRenderer'),
    emailSender: token<EmailSenderPort>('emailSender'),
  },
  commands: {
    sendEmailHandler: token<SendEmailHandler>('sendEmailHandler'),
  },
};
