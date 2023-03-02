import { Entity, EntityProps } from '@shakala/common';

type CommentSubscriptionProps = EntityProps<{
  userId: string;
  commentId: string;
}>;

export class CommentSubscription extends Entity<CommentSubscriptionProps> {
  get userId() {
    return this.props.userId;
  }

  get commentId() {
    return this.props.commentId;
  }
}
