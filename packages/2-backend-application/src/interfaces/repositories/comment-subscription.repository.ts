import { CommentSubscription } from 'backend-domain';

import { Repository } from '../repository';

export interface CommentSubscriptionRepository extends Repository<CommentSubscription> {
  findByCommentId(commentId: string): Promise<CommentSubscription[]>;
}
