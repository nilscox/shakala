import { AggregateRoot } from '../ddd/aggregate-root';
import { EntityProps } from '../ddd/entity';

type CommentSubscriptionProps = EntityProps<{
  userId: string;
  commentId: string;
}>;

export class CommentSubscription extends AggregateRoot<CommentSubscriptionProps> {
  get userId() {
    return this.props.userId;
  }

  get commentId() {
    return this.props.commentId;
  }
}
