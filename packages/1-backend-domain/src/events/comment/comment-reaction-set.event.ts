import { DomainEvent } from '../../ddd/domain-event';
import { ReactionType } from '../../entities/reaction.entity';

export class CommentReactionSetEvent implements DomainEvent {
  constructor(
    public readonly commentId: string,
    public readonly userId: string,
    public readonly reaction: ReactionType | null,
  ) {}
}
