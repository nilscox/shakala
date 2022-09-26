import { DomainEvent } from 'backend-domain';

import { ExecutionContext } from '../utils';

export interface EventHandler<Event extends DomainEvent> {
  handle(event: Event, ctx: ExecutionContext): void | Promise<void>;
}
