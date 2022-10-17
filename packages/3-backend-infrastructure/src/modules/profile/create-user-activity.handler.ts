import { CreateUserActivityCommand, EventHandler, ExecutionContext } from 'backend-application';
import { DomainEvent } from 'backend-domain';

import { CommandBus } from '../../infrastructure';

export class CreateUserActivityHandler implements EventHandler<DomainEvent> {
  constructor(private readonly commandBus: CommandBus) {}

  async handle(event: DomainEvent, ctx: ExecutionContext): Promise<void> {
    await this.commandBus.execute(new CreateUserActivityCommand(event), ctx);
  }
}
