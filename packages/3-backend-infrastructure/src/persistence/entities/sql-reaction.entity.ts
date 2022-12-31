import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Reaction, ReactionType } from '@shakala/backend-domain';

import { BaseSqlEntity } from '../base-classes/base-sql-entity';

import { SqlComment } from './sql-comment.entity';
import { SqlUser } from './sql-user.entity';

@Entity({ tableName: 'reaction' })
export class SqlReaction extends BaseSqlEntity<Reaction> {
  @ManyToOne()
  user!: SqlUser;

  @ManyToOne()
  comment!: SqlComment;

  @Property()
  type!: ReactionType;

  assignFromDomain(em: EntityManager, entity: Reaction) {
    this.id = entity.id;
    this.user = em.getReference(SqlUser, entity.userId);
    this.comment = em.getReference(SqlComment, entity.commentId);
    this.type = entity.type;
  }

  toDomain() {
    return new Reaction({
      id: this.id,
      userId: this.user.id,
      commentId: this.comment.id,
      type: this.type,
    });
  }
}
