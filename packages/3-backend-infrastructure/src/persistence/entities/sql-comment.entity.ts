import { Entity, ManyToOne, Property } from '@mikro-orm/core';

import { BaseEntity } from '../base-classes/base-entity';

import { Thread } from './sql-thread.entity';
import { User } from './sql-user.entity';

@Entity({ tableName: 'comment' })
export class Comment extends BaseEntity {
  @ManyToOne()
  thread!: Thread;

  @ManyToOne({ eager: true })
  author!: User;

  @ManyToOne()
  parent?: Comment;

  @Property({ columnType: 'text' })
  text!: string;

  @Property()
  created!: Date;
}
