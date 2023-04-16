import { AnyDomainEvent } from '../ddd/domain-event';

export interface TransactionalEventPublisher {
  addEvent(event: AnyDomainEvent): void;
  commit(): void;
}

export interface EventPublisher {
  publish(event: AnyDomainEvent): void;
  begin(): TransactionalEventPublisher;
}
