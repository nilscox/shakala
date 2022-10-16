import { DomainEvent } from '../../ddd/domain-event';

export class UserSignedOutEvent implements DomainEvent {
  constructor(public readonly userId: string) {}
}
