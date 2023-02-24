import EventEmitter from 'events';

import { EventPublisher } from '@shakala/common';
import { DomainEvent } from '@shakala/common/src/ddd/domain-event';

export class EmitterEventPublisher extends EventEmitter implements EventPublisher {
  publish(event: DomainEvent): void {
    this.emit(event.constructor.name, event);
  }
}
