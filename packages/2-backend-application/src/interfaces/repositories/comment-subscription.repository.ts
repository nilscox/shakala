import { CommentSubscription } from '@shakala/backend-domain';

import { Repository } from '../repository';

export interface CommentSubscriptionRepository extends Repository<CommentSubscription> {
  findForUserAndComment(userId: string, commentId: string): Promise<CommentSubscription | undefined>;
  findByCommentId(commentId: string): Promise<CommentSubscription[]>;
  getUserSubscriptions(commentIds: string[], userId: string): Promise<Map<string, boolean>>;
}
