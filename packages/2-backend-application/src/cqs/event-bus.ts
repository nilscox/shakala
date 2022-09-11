import { AggregateRoot } from 'backend-domain/src/ddd/aggregate-root';
import { DomainEvent } from 'backend-domain/src/ddd/domain-event';
import { EntityProps } from 'backend-domain/src/ddd/entity';

export interface IEventPublisher {
  addAggregate(aggregate: AggregateRoot<EntityProps>): void;
  publish(eventBus: IEventBus): void;
}

export interface IEventBus {
  publish(event: DomainEvent): void;
}
