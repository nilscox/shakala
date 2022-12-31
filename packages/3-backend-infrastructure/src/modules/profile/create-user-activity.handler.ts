import { CreateUserActivityCommand, EventHandler, ExecutionContext } from '@shakala/backend-application';
import { DomainEvent } from '@shakala/backend-domain';

import { CommandBus } from '../../infrastructure';

export class CreateUserActivityHandler implements EventHandler<DomainEvent> {
  constructor(private readonly commandBus: CommandBus) {}

  async handle(event: DomainEvent): Promise<void> {
    await this.commandBus.execute(new CreateUserActivityCommand(event), ExecutionContext.unauthenticated);
  }
}
