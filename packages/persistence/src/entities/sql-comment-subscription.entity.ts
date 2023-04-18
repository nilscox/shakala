import { Entity, ManyToOne } from '@mikro-orm/core';

import { BaseSqlEntity } from '../base-sql-entity';

import { SqlComment } from './sql-comment.entity';
import { SqlUser } from './sql-user.entity';

@Entity({ tableName: 'comment_subscription' })
// https://github.com/mikro-orm/mikro-orm/issues/4013
// @Unique({ properties: ['comment', 'user'] })
export class SqlCommentSubscription extends BaseSqlEntity {
  @ManyToOne()
  comment!: SqlComment;

  @ManyToOne({ eager: true })
  user!: SqlUser;
}
