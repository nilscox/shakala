import { PrimaryKey, Property } from '@mikro-orm/core';

export class BaseSqlEntity {
  @PrimaryKey()
  id!: string;

  @Property({ columnType: 'timestamp' })
  createdAt = new Date();

  @Property({ columnType: 'timestamp', onUpdate: () => new Date() })
  updatedAt = new Date();
}
