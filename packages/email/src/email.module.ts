import { Module } from '@shakala/common';
import { Container } from 'brandi';

import { FakeEmailCompilerAdapter } from './adapters/email-compiler/fake-email-compiler.adapter';
import { MjmlEmailCompilerAdapter } from './adapters/email-compiler/mjml-email-compiler.adapter';
import { EmailRendererAdapter } from './adapters/email-renderer/email-renderer.adapter';
import { FakeEmailRendererAdapter } from './adapters/email-renderer/fake-email-renderer.adapter';
import { NodeMailerEmailSenderAdapter } from './adapters/email-sender/node-mailer-email-sender.adapter';
import { StubEmailSenderAdapter } from './adapters/email-sender/stub-email-sender.adapter';
import { SendEmailHandler } from './commands/send-email/send-email';
import { EMAIL_TOKENS } from './tokens';

class EmailModule extends Module {
  async init(container: Container): Promise<void> {
    this.expose(container, EMAIL_TOKENS.commands)
    container.use(EMAIL_TOKENS.adapters.emailRenderer).from(this);
    await container.get(EMAIL_TOKENS.adapters.emailRenderer).init?.();
  }

  stub() {
    this.bind(EMAIL_TOKENS.adapters.emailCompiler).toInstance(FakeEmailCompilerAdapter).inContainerScope()
    this.bind(EMAIL_TOKENS.adapters.emailRenderer).toInstance(FakeEmailRendererAdapter).inContainerScope()
    this.bind(EMAIL_TOKENS.adapters.emailSender).toInstance(StubEmailSenderAdapter).inContainerScope()
  }
}

export const module = new EmailModule();

module.bind(EMAIL_TOKENS.adapters.emailCompiler).toInstance(MjmlEmailCompilerAdapter).inSingletonScope();
module.bind(EMAIL_TOKENS.adapters.emailRenderer).toInstance(EmailRendererAdapter).inSingletonScope();
module.bind(EMAIL_TOKENS.adapters.emailSender).toInstance(NodeMailerEmailSenderAdapter).inSingletonScope();

module.bind(EMAIL_TOKENS.commands.sendEmailHandler).toInstance(SendEmailHandler).inSingletonScope();
