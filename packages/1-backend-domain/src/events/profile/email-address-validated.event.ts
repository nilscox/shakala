import { DomainEvent } from '../../ddd/domain-event';

export class EmailAddressValidatedEvent implements DomainEvent {
  constructor(public readonly userId: string) {}
}
