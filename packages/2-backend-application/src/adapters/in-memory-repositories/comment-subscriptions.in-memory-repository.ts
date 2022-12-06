import { CommentSubscription } from 'backend-domain';

import { CommentSubscriptionRepository } from '../../interfaces';
import { InMemoryRepository } from '../../utils';

export class InMemoryCommentSubscriptionRepository
  extends InMemoryRepository<CommentSubscription>
  implements CommentSubscriptionRepository
{
  protected entityName = 'commentSubscription';

  async findByCommentId(commentId: string): Promise<CommentSubscription[]> {
    return this.filter((subscription) => subscription.commentId === commentId);
  }

  async getUserSubscriptions(commentIds: string[], userId: string): Promise<Map<string, boolean>> {
    const filter = (subscription: CommentSubscription) => {
      if (subscription.userId !== userId) {
        return false;
      }

      return commentIds.includes(subscription.commentId);
    };

    return new Map(this.filter(filter).map((subscription) => [subscription.commentId, true]));
  }
}
