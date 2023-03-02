import { Module } from '@shakala/common';

import { SendEmailHandler } from './commands/send-email/send-email.command';
import { MjmlEmailCompilerAdapter } from './ports/email-compiler/mjml-email-compiler.adapter';
import { NodeMailerEmailSenderAdapter } from './ports/email-sender/node-mailer-email-sender.adapter';
import { EMAIL_TOKENS } from './tokens';

export class EmailModule extends Module {
  async init() {
    this.bindToken(EMAIL_TOKENS.sendEmailHandler, SendEmailHandler);
    this.bindToken(EMAIL_TOKENS.emailCompiler, MjmlEmailCompilerAdapter);
    this.bindToken(EMAIL_TOKENS.emailSender, NodeMailerEmailSenderAdapter);

    this.registerCommandHandler(EMAIL_TOKENS.sendEmailHandler);

    await this.container.get(EMAIL_TOKENS.sendEmailHandler).init();
  }
}
