import { Repository } from '@shakala/common';

import { CommentSubscription } from '../../entities/comment-subscription.entity';

export interface CommentSubscriptionRepository extends Repository<CommentSubscription> {
  findForUserAndComment(userId: string, commentId: string): Promise<CommentSubscription | undefined>;
}
