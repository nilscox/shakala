import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Timestamp, UserActivity } from '@shakala/backend-domain';
import { UserActivityType, UserActivityPayload } from '@shakala/shared';

import { BaseSqlEntity } from '../base-classes/base-sql-entity';

import { SqlUser } from './sql-user.entity';

@Entity({ tableName: 'user_activity' })
export class SqlUserActivity extends BaseSqlEntity<UserActivity> {
  @Property()
  type!: UserActivityType;

  @ManyToOne()
  user!: SqlUser;

  @Property({ type: 'json', nullable: true })
  payload?: UserActivityPayload[UserActivityType];

  assignFromDomain(em: EntityManager, entity: UserActivity) {
    this.id = entity.id;
    this.type = entity.type;
    this.createdAt = entity.date.toDate();
    this.user = em.getReference(SqlUser, entity.userId);
    this.payload = entity.payload;
  }

  toDomain() {
    return new UserActivity({
      id: this.id,
      type: this.type,
      date: new Timestamp(this.createdAt),
      userId: this.user.id,
      payload: this.payload ?? undefined,
    });
  }
}
