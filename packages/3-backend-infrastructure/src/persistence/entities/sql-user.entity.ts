import { Entity, Property } from '@mikro-orm/core';

import { BaseEntity } from '../base-classes/base-entity';

@Entity({ tableName: 'user' })
export class User extends BaseEntity {
  @Property()
  email!: string;

  @Property()
  hashedPassword!: string;

  @Property()
  nick!: string;

  @Property()
  profileImage?: string;

  @Property()
  signupDate!: Date;

  @Property()
  lastLoginDate?: Date;
}
