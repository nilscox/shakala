import { Entity, Property } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { DomainDependencies, Nick, ProfileImage, Timestamp, User } from '@shakala/backend-domain';

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

  @Property()
  emailValidationToken?: string;

  @Property()
  hasWriteAccess!: boolean;

  assignFromDomain(_em: EntityManager, entity: User) {
    this.id = entity.id;
    this.email = entity.email;
    this.hashedPassword = entity.hashedPassword;
    this.nick = entity.nick.toString();
    this.profileImage = entity.profileImage?.toString();
    this.createdAt = entity.signupDate.toDate();
    this.lastLoginDate = entity.lastLoginDate?.toDate();
    this.emailValidationToken = entity.emailValidationToken ?? undefined;
    this.hasWriteAccess = entity.hasWriteAccess;
  }

  toDomain({ generator, date, crypto, profileImageStore }: DomainDependencies) {
    return new User(
      {
        id: this.id,
        email: this.email,
        hashedPassword: this.hashedPassword,
        nick: new Nick(this.nick),
        profileImage: this.profileImage ? new ProfileImage(this.profileImage) : null,
        signupDate: new Timestamp(this.createdAt),
        lastLoginDate: this.lastLoginDate ? new Timestamp(this.lastLoginDate) : null,
        emailValidationToken: this.emailValidationToken ?? null,
        hasWriteAccess: this.hasWriteAccess,
      },
      generator,
      date,
      crypto,
      profileImageStore,
    );
  }
}
