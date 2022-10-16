import { DomainEvent } from '../../ddd/domain-event';

export class CommentEditedEvent implements DomainEvent {
  constructor(public readonly commentId: string) {}
}
