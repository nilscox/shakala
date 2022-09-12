import { AggregateRoot, DomainEvent, EntityProps } from 'backend-domain';

export interface IEventPublisher {
  addAggregate(aggregate: AggregateRoot<EntityProps>): void;
  publish(eventBus: IEventBus): void;
}

export interface IEventBus {
  publish(event: DomainEvent): void;
}
