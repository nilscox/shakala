import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { ReactionType } from '@shakala/shared';

import { BaseSqlEntity } from '../base-sql-entity';

import { SqlComment } from './sql-comment.entity';
import { SqlUser } from './sql-user.entity';

@Entity({ tableName: 'reaction' })
export class SqlReaction extends BaseSqlEntity {
  @ManyToOne()
  user!: SqlUser;

  @ManyToOne()
  comment!: SqlComment;

  @Property()
  type!: ReactionType;
}
