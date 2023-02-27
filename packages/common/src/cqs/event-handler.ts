import { DomainEvent } from '../ddd/domain-event';

export interface EventHandler<Event extends DomainEvent> {
  handle(event: Event): Promise<void>;
}
