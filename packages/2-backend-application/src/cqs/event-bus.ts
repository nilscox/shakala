import { AggregateRoot, DomainEvent, EntityProps } from 'backend-domain';

import { ExecutionContext } from '../utils/execution-context';

export interface IEventPublisher {
  addAggregate(aggregate: AggregateRoot<EntityProps>): void;
  publish(eventBus: IEventBus): void;
}

export interface IEventBus {
  publish(event: DomainEvent, ctx: ExecutionContext): void;
}
