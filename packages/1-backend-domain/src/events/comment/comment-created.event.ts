import { DomainEvent } from '../../ddd/domain-event';

export class CommentCreatedEvent implements DomainEvent {
  constructor(public readonly commentId: string) {}
}
