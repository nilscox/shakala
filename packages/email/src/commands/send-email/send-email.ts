import { commandCreator, CommandHandler, registerCommand } from '@shakala/common';
import { injected } from 'brandi';

import { EmailRendererPort } from '../../adapters/email-renderer/email-renderer.port';
import { EmailSenderPort } from '../../adapters/email-sender/email-sender.port';
import { EmailKind, EmailPayloadMap } from '../../entities/emails-payloads';
import { EMAIL_TOKENS } from '../../tokens';

export type SendEmailCommand<Kind extends EmailKind> = {
  to: string;
  kind: Kind;
  payload: EmailPayloadMap[Kind];
};

export const sendEmail = commandCreator<SendEmailCommand<EmailKind>>('sendEmail');

export class SendEmailHandler implements CommandHandler<SendEmailCommand<EmailKind>> {
  constructor(
    private readonly emailRenderer: EmailRendererPort,
    private readonly emailSender: EmailSenderPort
  ) {}

  async handle(command: SendEmailCommand<EmailKind>): Promise<void> {
    const { to, kind, payload } = command;

    await this.emailSender.send({
      to,
      subject: 'Bienvenue sur Shakala !',
      body: this.emailRenderer.render(kind, payload),
    });
  }
}

injected(SendEmailHandler, EMAIL_TOKENS.adapters.emailRenderer, EMAIL_TOKENS.adapters.emailSender);

registerCommand(sendEmail, EMAIL_TOKENS.commands.sendEmailHandler);
