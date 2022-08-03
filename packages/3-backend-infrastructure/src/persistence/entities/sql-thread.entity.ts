import { Entity, ManyToOne, Property } from '@mikro-orm/core';

import { BaseEntity } from '../base-classes/base-entity';

import { User } from './sql-user.entity';

@Entity({ tableName: 'thread' })
export class Thread extends BaseEntity {
  @ManyToOne({ eager: true })
  author!: User;

  @Property({ columnType: 'text' })
  text!: string;

  @Property()
  created!: Date;
}
