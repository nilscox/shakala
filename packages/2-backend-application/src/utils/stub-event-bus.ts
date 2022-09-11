import { DomainEvent } from 'backend-domain';
import { last } from 'shared';

import { IEventBus } from '../cqs/event-bus';

export class StubEventBus implements IEventBus {
  public events: DomainEvent[] = [];

  publish(event: DomainEvent) {
    this.events.push(event);
  }

  get lastEvent(): DomainEvent | undefined {
    return last(this.events);
  }
}
