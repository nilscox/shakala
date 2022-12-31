import { AggregateRoot, DomainEvent, EntityProps } from '@shakala/backend-domain';

import { ExecutionContext } from '../utils';

export interface IEventPublisher {
  addAggregate(aggregate: AggregateRoot<EntityProps>): void;
  publish(eventBus: IEventBus): void;
}

export interface IEventBus {
  publish(event: DomainEvent, ctx: ExecutionContext): void;
}
