import { Module } from '@shakala/common';

import { MjmlEmailCompilerAdapter } from './adapters/email-compiler/mjml-email-compiler.adapter';
import { NodeMailerEmailSenderAdapter } from './adapters/email-sender/node-mailer-email-sender.adapter';
import { StubEmailSenderAdapter } from './adapters/email-sender/stub-email-sender.adapter';
import { SendEmailHandler } from './commands/send-email/send-email';
import { EMAIL_TOKENS } from './tokens';

type EmailModuleConfig = {
  emailSender: 'nodemailer' | 'stub';
};

export class EmailModule extends Module {
  configure(config: EmailModuleConfig) {
    if (config.emailSender === 'nodemailer') {
      this.bindToken(EMAIL_TOKENS.adapters.emailSender, NodeMailerEmailSenderAdapter);
    } else {
      this.bindToken(EMAIL_TOKENS.adapters.emailSender, StubEmailSenderAdapter);
    }

    this.bindToken(EMAIL_TOKENS.adapters.emailCompiler, MjmlEmailCompilerAdapter);

    this.bindToken(EMAIL_TOKENS.commands.sendEmailHandler, SendEmailHandler);
  }

  async init() {
    await this.container.get(EMAIL_TOKENS.commands.sendEmailHandler).init();
  }
}
