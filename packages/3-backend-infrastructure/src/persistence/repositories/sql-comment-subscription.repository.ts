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
}
