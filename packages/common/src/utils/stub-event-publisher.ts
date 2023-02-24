import { EventPublisher } from '../cqs/event-publisher';
import { DomainEvent } from '../ddd/domain-event';

export class StubEventPublisher extends Set<DomainEvent> implements EventPublisher {
  get events() {
    return Array.from(this.values());
  }

  publish = this.add.bind(this);
}
