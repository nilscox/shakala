import { AggregateRoot, DomainEvent, EntityProps } from 'backend-domain';

import { IEventBus, IEventPublisher } from '../cqs/event-bus';

export class EventPublisher implements IEventPublisher {
  constructor(aggregate: AggregateRoot<EntityProps>) {
    this.addAggregate(aggregate);
  }

  private events: DomainEvent[] = [];

  addAggregate(aggregate: AggregateRoot<EntityProps>) {
    this.events.push(...aggregate.events);
    aggregate.clearEvents();

    aggregate.addEvent = (event: DomainEvent) => {
      this.events.push(event);
    };
  }

  publish(eventBus: IEventBus) {
    for (const event of this.events) {
      eventBus.publish(event);
    }
  }
}
