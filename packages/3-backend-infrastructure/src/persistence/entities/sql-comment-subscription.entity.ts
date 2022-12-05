import { Entity, ManyToOne } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { CommentSubscription } from 'backend-domain';

import { BaseSqlEntity } from '../base-classes/base-sql-entity';

import { SqlComment } from './sql-comment.entity';
import { SqlUser } from './sql-user.entity';

@Entity({ tableName: 'comment_subscription' })
export class SqlCommentSubscription extends BaseSqlEntity<CommentSubscription> {
  @ManyToOne()
  comment!: SqlComment;

  @ManyToOne()
  user!: SqlUser;

  assignFromDomain(em: EntityManager, entity: CommentSubscription) {
    this.id = entity.id;
    this.comment = em.getReference(SqlComment, entity.commentId);
    this.user = em.getReference(SqlUser, entity.userId);
  }

  toDomain() {
    return new CommentSubscription({
      id: this.id,
      commentId: this.comment.id,
      userId: this.user.id,
    });
  }
}
