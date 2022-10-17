import EventEmitter from 'events';

import { EventHandler, IEventBus } from 'backend-application';
import { DomainEvent } from 'backend-domain';
import { ClassType } from 'shared';

export class EventBus extends EventEmitter implements IEventBus {
  subscribe<Event extends DomainEvent>(eventClass: ClassType<Event>, handler: EventHandler<Event>) {
    this.addListener(eventClass.name, handler.handle.bind(handler));
  }

  publish(event: DomainEvent) {
    this.emit(event.constructor.name, event);
  }
}
