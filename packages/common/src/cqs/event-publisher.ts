import { DomainEvent } from '../ddd/domain-event';

export interface EventPublisher {
  publish(event: DomainEvent): void;
}
