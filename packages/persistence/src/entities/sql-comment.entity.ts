import { Collection, Entity, Formula, ManyToOne, OneToMany, Property } from '@mikro-orm/core';
import { ReactionType } from '@shakala/shared';

import { BaseSqlEntity } from '../base-sql-entity';

import { SqlThread } from './sql-thread.entity';
import { SqlUser } from './sql-user.entity';

@Entity({ tableName: 'comment' })
export class SqlComment extends BaseSqlEntity {
  @ManyToOne()
  thread!: SqlThread;

  @ManyToOne({ eager: true })
  author!: SqlUser;

  @ManyToOne({ nullable: true })
  parent!: SqlComment | null;

  @OneToMany(() => SqlMessage, (message) => message.comment, { eager: true })
  history = new Collection<SqlMessage>(this);

  @OneToMany(() => SqlComment, (comment) => comment.parent)
  replies = new Collection<SqlComment>(this);

  @Property({ persist: false })
  userReaction!: ReactionType | null;

  @Property({ persist: false })
  userSubscribed!: true | null;

  @Formula(
    (alias) =>
      `(select count(*) from "reaction" where comment_id = ${alias}.id and type = '${ReactionType.upvote}')`
  )
  upvotes!: number;

  @Formula(
    (alias) =>
      `(select count(*) from "reaction" where comment_id = ${alias}.id and type = '${ReactionType.downvote}')`
  )
  downvotes!: number;
}

@Entity({ tableName: 'message' })
export class SqlMessage extends BaseSqlEntity {
  @ManyToOne()
  comment!: SqlComment;

  @Property({ columnType: 'text' })
  text!: string;
}
