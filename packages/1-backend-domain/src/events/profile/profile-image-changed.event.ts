import { DomainEvent } from '../../ddd/domain-event';

export class ProfileImageChangedEvent implements DomainEvent {
  constructor(public readonly userId: string, public readonly imageId: string | null) {}
}
