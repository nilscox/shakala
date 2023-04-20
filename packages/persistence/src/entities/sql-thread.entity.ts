import { ArrayType, Collection, Entity, Filter, ManyToOne, OneToMany, Property } from '@mikro-orm/core';

import { BaseSqlEntity } from '../base-sql-entity';

import { SqlComment } from './sql-comment.entity';
import { SqlUser } from './sql-user.entity';

@Entity({ tableName: 'thread' })
@Filter({ name: 'not-hidden', default: true, cond: { hidden: false } })
export class SqlThread extends BaseSqlEntity {
  @ManyToOne({ eager: true })
  author!: SqlUser;

  @Property()
  description!: string;

  @Property({ columnType: 'text' })
  text!: string;

  @Property({ type: ArrayType })
  keywords!: string[];

  @OneToMany(() => SqlComment, (comment) => comment.thread)
  comments = new Collection<SqlComment>(this);

  @Property({ default: false })
  hidden!: boolean;
}
