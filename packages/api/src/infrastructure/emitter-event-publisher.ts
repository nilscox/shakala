import EventEmitter from 'events';

import { DomainEvent, EventPublisher } from '@shakala/common';

export class EmitterEventPublisher extends EventEmitter implements EventPublisher {
  publish(event: DomainEvent): void {
    this.emit(event.constructor.name, event);
  }
}
