import {
  PERSISTENCE_TOKENS,
  SqlComment,
  SqlCommentSubscription,
  SqlRepository,
  SqlUser,
} from '@shakala/persistence';
import { injected } from 'brandi';

import { CommentSubscription } from '../../entities/comment-subscription.entity';

import { CommentSubscriptionRepository } from './comment-subscription.repository';

export class SqlCommentSubscriptionRepository
  extends SqlRepository<CommentSubscription, SqlCommentSubscription>
  implements CommentSubscriptionRepository
{
  SqlEntity = SqlCommentSubscription;

  protected toEntity(sqlSubscription: SqlCommentSubscription): CommentSubscription {
    return new CommentSubscription({
      id: sqlSubscription.id,
      commentId: sqlSubscription.comment.id,
      userId: sqlSubscription.user.id,
    });
  }

  protected toSql(subscription: CommentSubscription): SqlCommentSubscription {
    return Object.assign(new SqlCommentSubscription(), {
      id: subscription.id,
      comment: this.em.getReference(SqlComment, subscription.commentId),
      user: this.em.getReference(SqlUser, subscription.userId),
    });
  }

  async findForComment(commentId: string): Promise<CommentSubscription[]> {
    const sqlSubscriptions = await this.repository.find({ comment: commentId });

    return sqlSubscriptions.map((sqlSubscription) => this.toEntity(sqlSubscription));
  }

  async findForUserAndComment(userId: string, commentId: string): Promise<CommentSubscription | undefined> {
    const sqlSubscription = await this.repository.findOne({ user: userId, comment: commentId });

    if (sqlSubscription) {
      return this.toEntity(sqlSubscription);
    }
  }
}

injected(SqlCommentSubscriptionRepository, PERSISTENCE_TOKENS.database);
