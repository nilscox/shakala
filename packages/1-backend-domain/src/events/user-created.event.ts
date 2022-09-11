import { DomainEvent } from '../ddd/domain-event';

export class UserCreatedEvent implements DomainEvent {
  constructor(public readonly userId: string) {}
}
