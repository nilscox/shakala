import { EntityManager } from '@mikro-orm/postgresql';
import { CommentSubscriptionRepository } from 'backend-application';
import { CommentSubscription, DomainDependencies } from 'backend-domain';

import { BaseSqlRepository } from '../base-classes/base-sql-repository';
import { SqlCommentSubscription } from '../entities/sql-comment-subscription.entity';

export class SqlCommentSubscriptionRepository
  extends BaseSqlRepository<SqlCommentSubscription, CommentSubscription>
  implements CommentSubscriptionRepository
{
  constructor(em: EntityManager, deps: DomainDependencies) {
    super(em, deps, SqlCommentSubscription);
  }

  protected get entityName(): string {
    return 'CommentSubscription';
  }

  async findByCommentId(commentId: string): Promise<CommentSubscription[]> {
    return this.toDomain(await this.repository.find({ comment: { id: commentId } }));
  }

  async getUserSubscriptions(commentIds: string[], userId: string): Promise<Map<string, boolean>> {
    const subscriptions = await this.findAll({
      comment: { id: { $in: commentIds } },
      user: { id: userId },
    });

    const isSubscribed = (commentId: string) => {
      return Boolean(subscriptions.items.find((subscription) => subscription.commentId === commentId));
    };

    return new Map(commentIds.map((commentId) => [commentId, isSubscribed(commentId)]));
  }
}
