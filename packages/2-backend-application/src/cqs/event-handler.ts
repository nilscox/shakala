import { DomainEvent } from 'backend-domain';

import { ExecutionContext } from '../utils/execution-context';

export interface EventHandler<Event extends DomainEvent> {
  handle(event: Event, ctx: ExecutionContext): void | Promise<void>;
}
