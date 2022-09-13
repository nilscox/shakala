import { EventHandler, ExecutionContext, IEventBus, LoggerService } from 'backend-application';
import { DomainEvent } from 'backend-domain';
import { ClassType } from 'shared';

export class EventBus implements IEventBus {
  private handlers = new Map<string, Array<EventHandler<DomainEvent>>>();

  constructor(private readonly logger: LoggerService) {}

  registerHandler<Event extends DomainEvent>(eventClass: ClassType<Event>, handler: EventHandler<Event>) {
    const name = eventClass.name;
    const handlers = this.handlers.get(name) ?? [];

    this.handlers.set(name, [...handlers, handler]);
  }

  publish(event: DomainEvent, ctx: ExecutionContext) {
    const handlers = this.handlers.get(event.constructor.name);

    if (handlers) {
      handlers.forEach((handler) => handler.handle(event, ctx));
    } else {
      this.logger.log('warning: no handler found for event ' + event.constructor.name);
    }
  }
}
