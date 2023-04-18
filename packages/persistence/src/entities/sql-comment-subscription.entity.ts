import { Entity, ManyToOne } from '@mikro-orm/core';

import { BaseSqlEntity } from '../base-sql-entity';

import { SqlComment } from './sql-comment.entity';
import { SqlUser } from './sql-user.entity';

@Entity({ tableName: 'comment_subscription' })
// todo: fix intg tests with unique constraint (refresh database fails)
// @Unique({ properties: ['comment', 'user'] })
export class SqlCommentSubscription extends BaseSqlEntity {
  @ManyToOne()
  comment!: SqlComment;

  @ManyToOne({ eager: true })
  user!: SqlUser;
}
