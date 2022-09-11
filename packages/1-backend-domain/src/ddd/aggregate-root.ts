import { DomainEvent } from './domain-event';
import { Entity, EntityProps } from './entity';

export class AggregateRoot<Props extends EntityProps> extends Entity<Props> {
  events: DomainEvent[] = [];

  addEvent(event: DomainEvent) {
    this.events.push(event);
  }

  clearEvents() {
    this.events = [];
  }
}
