import { AnyDomainEvent } from '../ddd/domain-event';

export interface EventHandler<Event extends AnyDomainEvent> {
  handle(event: Event): Promise<void>;
}
