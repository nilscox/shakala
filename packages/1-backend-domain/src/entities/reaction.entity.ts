import { Entity, EntityProps } from '../ddd/entity';

export enum ReactionType {
  upvote = 'upvote',
  downvote = 'downvote',
}

export type ReactionsCount = Record<ReactionType, number>;

export type ReactionProps = EntityProps<{
  userId: string;
  commentId: string;
  type: ReactionType;
}>;

export class Reaction extends Entity<ReactionProps> {
  get userId(): string {
    return this.props.userId;
  }

  get commentId(): string {
    return this.props.commentId;
  }

  get type(): ReactionType {
    return this.props.type;
  }

  setType(type: ReactionType) {
    this.props.type = type;
  }
}
