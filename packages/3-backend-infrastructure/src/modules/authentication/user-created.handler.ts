import { EmailKind, EventHandler, SendEmailCommand } from 'backend-application';
import { UserCreatedEvent } from 'backend-domain';

import { CommandBus } from '../../infrastructure';

export class UserCreatedHandler implements EventHandler<UserCreatedEvent> {
  constructor(private readonly commandBus: CommandBus) {}

  async handle(event: UserCreatedEvent): Promise<void> {
    await this.commandBus.execute(new SendEmailCommand(EmailKind.welcome, { userId: event.userId }));
  }
}
