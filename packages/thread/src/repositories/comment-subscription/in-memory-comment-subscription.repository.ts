import { InMemoryRepository } from '@shakala/common';

import { CommentSubscription } from '../../entities/comment-subscription.entity';

import { CommentSubscriptionRepository } from './comment-subscription.repository';

export class InMemoryCommentSubscriptionRepository
  extends InMemoryRepository<CommentSubscription>
  implements CommentSubscriptionRepository
{
  entity = CommentSubscription;

  async findForUserAndComment(userId: string, commentId: string): Promise<CommentSubscription | undefined> {
    return this.find(
      (subscription) => subscription.userId === userId && subscription.commentId === commentId
    );
  }
}
