import { Command, CommandHandler } from '../../cqs/command-handler';
import { EmailCompilerPort, EmailRenderer } from '../../interfaces/email-compiler.port';
import { EmailSenderPort } from '../../interfaces/email-sender.port';
import { FilesystemPort } from '../../interfaces/filesystem.port';

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
    private readonly filesystem: FilesystemPort,
    private readonly emailCompiler: EmailCompilerPort,
    private readonly emailSender: EmailSenderPort,
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
    const templateHtml = await this.filesystem.readEmailTemplate(`${kind}.mjml`);
    const templateText = await this.filesystem.readEmailTemplate(`${kind}.txt`);

    return this.emailCompiler.compile(templateText, templateHtml);
  }
}
