import { Command, CommandHandler } from '../cqs/command-handler';

export enum EmailKind {
  welcome = 'welcome',
}

type EmailData = {
  [EmailKind.welcome]: { userId: string };
};

export class SendEmailCommand<Kind extends EmailKind> implements Command {
  constructor(public readonly kind: Kind, public readonly data: EmailData[Kind]) {}
}

export class SendEmailHandler implements CommandHandler<SendEmailCommand<EmailKind>> {
  handle(command: SendEmailCommand<EmailKind>): void | Promise<void> {
    console.log(`send ${command.kind} email to ${command.data.userId}`);
  }
}
