import path from 'path';

import { Command, CommandHandler } from '../../cqs/command-handler';
import { EmailRenderer, EmailService } from '../../interfaces/email.service';
import { FilesystemService } from '../../interfaces/filesystem.service';

export enum EmailKind {
  welcome = 'welcome',
}

type EmailPayloadMap = {
  [EmailKind.welcome]: {
    nick: string;
    emailValidationLink: string;
  };
};

export class SendEmailCommand<Kind extends EmailKind> implements Command {
  constructor(
    public readonly to: string,
    public readonly kind: Kind,
    public readonly payload: EmailPayloadMap[Kind],
  ) {}
}

export class SendEmailHandler implements CommandHandler<SendEmailCommand<EmailKind>> {
  private renderers = new Map<EmailKind, EmailRenderer>();

  constructor(
    private readonly filesystemService: FilesystemService,
    private readonly emailService: EmailService,
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
      throw new Error(`no renderer found for email kind ${kind}`);
    }

    await this.emailService.send({
      from: 'hello@shakala.fr',
      to,
      subject: 'Bienvenue sur Shakala !',
      body: renderer(payload),
    });
  }

  private async loadTemplate(kind: EmailKind) {
    const filePath = (ext: string) => path.join(__dirname, 'templates', `${kind}.${ext}`);

    const templateHtml = await this.filesystemService.readFile(filePath('mjml'));
    const templateText = await this.filesystemService.readFile(filePath('txt'));

    return this.emailService.compile(templateText, templateHtml);
  }
}
