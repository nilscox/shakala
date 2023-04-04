import { Entity, ManyToOne, Property } from '@mikro-orm/core';

import { BaseSqlEntity } from '../base-sql-entity';

import { SqlComment } from './sql-comment.entity';
import { SqlUser } from './sql-user.entity';

@Entity({ tableName: 'comment_report' })
export class SqlCommentReport extends BaseSqlEntity {
  @ManyToOne()
  comment!: SqlComment;

  @ManyToOne({ eager: true })
  reportedBy!: SqlUser;

  @Property({ nullable: true })
  reason!: string | null;
}
