import { Entity, ManyToOne, Property } from '@mikro-orm/core';

import { BaseSqlEntity } from '../base-sql-entity';

import { SqlUser } from './sql-user.entity';

@Entity({ tableName: 'notification' })
export class SqlNotification extends BaseSqlEntity {
  @Property()
  type!: string;

  @ManyToOne()
  user!: SqlUser;

  @Property({ type: 'jsonb' })
  payload!: unknown;

  @Property({ columnType: 'timestamp', nullable: true })
  seenAt!: Date | null;
}
