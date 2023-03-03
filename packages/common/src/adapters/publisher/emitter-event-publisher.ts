import EventEmitter from 'events';

import { EventPublisher } from '../../cqs/event-publisher';
import { DomainEvent } from '../../ddd/domain-event';

export class EmitterEventPublisher extends EventEmitter implements EventPublisher {
  publish(event: DomainEvent): void {
    this.emit(event.constructor.name, event);
  }
}
