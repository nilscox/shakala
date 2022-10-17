import { DomainEvent } from 'backend-domain';

export interface EventHandler<Event extends DomainEvent> {
  handle(event: Event): void | Promise<void>;
}
