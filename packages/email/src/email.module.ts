import { Module } from '@shakala/common';

import { MjmlEmailCompilerAdapter } from './adapters/email-compiler/mjml-email-compiler.adapter';
import { NodeMailerEmailSenderAdapter } from './adapters/email-sender/node-mailer-email-sender.adapter';
import { SendEmailHandler } from './commands/send-email/send-email.command';
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
