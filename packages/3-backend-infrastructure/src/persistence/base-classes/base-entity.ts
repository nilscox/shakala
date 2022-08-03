import { PrimaryKey, Property } from '@mikro-orm/core';

export class BaseEntity {
  @PrimaryKey()
  id!: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}
