import { DomainEvent } from '../../ddd/domain-event';

export class ThreadCreatedEvent implements DomainEvent {
  constructor(public readonly threadId: string) {}
}
