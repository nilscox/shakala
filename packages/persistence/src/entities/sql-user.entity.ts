import { Entity, Property } from '@mikro-orm/core';

import { BaseSqlEntity } from '../base-sql-entity';

@Entity({ tableName: 'user' })
export class SqlUser extends BaseSqlEntity {
  @Property()
  nick!: string;

  @Property()
  email!: string;

  @Property()
  hashedPassword!: string;

  @Property()
  emailValidationToken!: string | null;

  @Property()
  lastLoginDate?: Date;

  @Property()
  hasWriteAccess!: boolean;
}
