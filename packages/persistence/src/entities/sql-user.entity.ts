import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class SqlUser {
  @PrimaryKey()
  id!: string;

  @Property()
  nick!: string;

  @Property()
  email!: string;

  @Property()
  hashedPassword!: string;

  @Property()
  emailValidationToken!: string | null;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}
