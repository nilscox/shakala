import { Entity, Property } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Nick, ProfileImage, Timestamp, User } from 'backend-domain';

import { BaseSqlEntity } from '../base-classes/base-sql-entity';

@Entity({ tableName: 'user' })
export class SqlUser extends BaseSqlEntity<User> {
  @Property()
  email!: string;

  @Property()
  hashedPassword!: string;

  @Property()
  nick!: string;

  @Property()
  profileImage?: string;

  @Property()
  lastLoginDate?: Date;

  assignFromDomain(_em: EntityManager, entity: User) {
    this.id = entity.id;
    this.email = entity.email;
    this.hashedPassword = entity.hashedPassword;
    this.nick = entity.nick.toString();
    this.profileImage = entity.profileImage.toString() ?? undefined;
    this.createdAt = entity.signupDate.toDate();
    this.lastLoginDate = entity.lastLoginDate?.toDate();
  }

  toDomain() {
    return new User({
      id: this.id,
      email: this.email,
      hashedPassword: this.hashedPassword,
      nick: new Nick(this.nick),
      profileImage: new ProfileImage(this.profileImage),
      signupDate: new Timestamp(this.createdAt),
      lastLoginDate: this.lastLoginDate ? new Timestamp(this.lastLoginDate) : null,
    });
  }
}
