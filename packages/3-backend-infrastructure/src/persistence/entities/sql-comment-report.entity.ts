import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { CommentReport, DomainDependencies } from '@shakala/backend-domain';

import { BaseSqlEntity } from '../base-classes/base-sql-entity';

import { SqlComment } from './sql-comment.entity';
import { SqlUser } from './sql-user.entity';

@Entity({ tableName: 'comment_report' })
export class SqlCommentReport extends BaseSqlEntity<CommentReport> {
  @ManyToOne()
  comment!: SqlComment;

  @ManyToOne({ eager: true })
  reportedBy!: SqlUser;

  @Property()
  reason?: string;

  assignFromDomain(em: EntityManager, entity: CommentReport) {
    this.id = entity.id;
    this.comment = em.getReference(SqlComment, entity.commentId);
    this.reportedBy = em.getReference(SqlUser, entity.reportedBy.id);
    this.reason = entity.reason ?? undefined;
  }

  toDomain(deps: DomainDependencies) {
    return new CommentReport({
      id: this.id,
      commentId: this.comment.id,
      reportedBy: this.reportedBy.toDomain(deps),
      reason: this.reason ?? null,
    });
  }
}
