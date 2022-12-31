import EventEmitter from 'events';

import { EventHandler, IEventBus } from '@shakala/backend-application';
import { DomainEvent } from '@shakala/backend-domain';
import { ClassType } from '@shakala/shared';

export class EventBus extends EventEmitter implements IEventBus {
  subscribe<Event extends DomainEvent>(eventClass: ClassType<Event>, handler: EventHandler<Event>) {
    this.addListener(eventClass.name, handler.handle.bind(handler));
  }

  publish(event: DomainEvent) {
    this.emit(event.constructor.name, event);
  }
}
