import { Module } from '@shakala/common';
import { Container } from 'brandi';

import { MjmlEmailCompilerAdapter } from './adapters/email-compiler/mjml-email-compiler.adapter';
import { NodeMailerEmailSenderAdapter } from './adapters/email-sender/node-mailer-email-sender.adapter';
import { StubEmailSenderAdapter } from './adapters/email-sender/stub-email-sender.adapter';
import { SendEmailHandler } from './commands/send-email/send-email';
import { EMAIL_TOKENS } from './tokens';

export class EmailModule extends Module {
  constructor(container: Container) {
    super(container);

    this.bindToken(EMAIL_TOKENS.adapters.emailCompiler, MjmlEmailCompilerAdapter);
    this.bindToken(EMAIL_TOKENS.adapters.emailSender, NodeMailerEmailSenderAdapter);

    this.bindToken(EMAIL_TOKENS.commands.sendEmailHandler, SendEmailHandler);
  }

  async init() {
    this.registerCommandHandler(EMAIL_TOKENS.commands.sendEmailHandler);

    await this.container.get(EMAIL_TOKENS.commands.sendEmailHandler).init();
  }
}

export class TestEmailModule extends EmailModule {
  constructor(container: Container) {
    super(container);

    this.bindToken(EMAIL_TOKENS.adapters.emailSender, StubEmailSenderAdapter);
  }

  async init() {
    await super.init();

    this.bindToken(EMAIL_TOKENS.adapters.emailSender, StubEmailSenderAdapter);
  }
}
