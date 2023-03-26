import { Entity, ManyToOne, Property } from '@mikro-orm/core';

import { BaseSqlEntity } from '../base-sql-entity';

import { SqlUser } from './sql-user.entity';

@Entity({ tableName: 'user_activity' })
export class SqlUserActivity extends BaseSqlEntity {
  @Property()
  type!: string;

  @ManyToOne()
  user!: SqlUser;

  @Property({ type: 'jsonb', nullable: true })
  payload!: unknown | null;
}
