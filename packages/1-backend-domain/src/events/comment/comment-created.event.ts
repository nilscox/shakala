import { DomainEvent } from '../../ddd/domain-event';

export class CommentCreatedEvent implements DomainEvent {
  constructor(public readonly commentId: string) {}
}

export class CommentReplyCreatedEvent implements DomainEvent {
  constructor(public readonly replyId: string) {}
}
