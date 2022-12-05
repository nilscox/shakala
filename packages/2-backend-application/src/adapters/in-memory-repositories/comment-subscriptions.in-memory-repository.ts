import { CommentSubscription } from 'backend-domain';

import { CommentSubscriptionRepository } from '../../interfaces';
import { InMemoryRepository } from '../../utils';

export class InMemoryCommentSubscriptionRepository
  extends InMemoryRepository<CommentSubscription>
  implements CommentSubscriptionRepository
{
  async findByCommentId(commentId: string): Promise<CommentSubscription[]> {
    return this.filter((subscription) => subscription.commentId === commentId);
  }
}
