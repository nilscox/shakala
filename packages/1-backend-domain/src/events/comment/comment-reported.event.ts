import { DomainEvent } from '../../ddd/domain-event';

export class CommentReportedEvent implements DomainEvent {
  constructor(
    public readonly commentId: string,
    public readonly userId: string,
    public readonly reason?: string,
  ) {}
}
