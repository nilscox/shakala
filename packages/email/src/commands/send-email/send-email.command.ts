import path from 'path';

import { CommandHandler, ConfigPort, FilesystemPort, TOKENS } from '@shakala/common';
import { injected } from 'brandi';

import { EmailRenderer } from '../../entities/email';
import { EmailCompilerPort } from '../../ports/email-compiler/email-compiler.port';
import { EmailSenderPort } from '../../ports/email-sender/email-sender.port';
import { EMAIL_TOKENS } from '../../tokens';

export enum EmailKind {
  welcome = 'welcome',
}

type EmailPayloadMap = {
  [EmailKind.welcome]: {
    appBaseUrl: string;
    nick: string;
    emailValidationLink: string;
  };
};

export type SendEmailCommand<Kind extends EmailKind> = {
  to: string;
  kind: Kind;
  payload: EmailPayloadMap[Kind];
};

export class SendEmailHandler implements CommandHandler<SendEmailCommand<EmailKind>> {
  private renderers = new Map<EmailKind, EmailRenderer>();

  constructor(
    private readonly config: ConfigPort,
    private readonly filesystem: FilesystemPort,
    private readonly emailCompiler: EmailCompilerPort,
    private readonly emailSender: EmailSenderPort
  ) {}

  async init(): Promise<void> {
    for (const kind of Object.values(EmailKind)) {
      this.renderers.set(kind, await this.loadTemplate(kind));
    }
  }

  async handle(command: SendEmailCommand<EmailKind>): Promise<void> {
    const { to, kind, payload } = command;
    const renderer = this.renderers.get(kind);

    if (!renderer) {
      throw new Error(`no renderer found for email kind "${kind}"`);
    }

    await this.emailSender.send({
      to,
      subject: 'Bienvenue sur Shakala !',
      body: renderer(payload),
    });
  }

  private async loadTemplate(kind: EmailKind) {
    const { templatesPath } = this.config.email;

    const templatePath = (ext: string) => {
      return path.join(templatesPath, `${kind}.${ext}`);
    };

    const templateHtml = await this.filesystem.readFile(templatePath('mjml'));
    const templateText = await this.filesystem.readFile(templatePath('txt'));

    return this.emailCompiler.compile(templateText, templateHtml);
  }
}

injected(
  SendEmailHandler,
  TOKENS.config,
  TOKENS.filesystem,
  EMAIL_TOKENS.emailCompiler,
  EMAIL_TOKENS.emailSender
);
