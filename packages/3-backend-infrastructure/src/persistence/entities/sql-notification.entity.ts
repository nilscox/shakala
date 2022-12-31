import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Timestamp, Notification } from '@shakala/backend-domain';
import { NotificationType, NotificationPayloadMap } from '@shakala/shared';

import { BaseSqlEntity } from '../base-classes/base-sql-entity';

import { SqlUser } from './sql-user.entity';

@Entity({ tableName: 'notification' })
export class SqlNotification extends BaseSqlEntity<Notification> {
  @Property()
  type!: NotificationType;

  @ManyToOne()
  user!: SqlUser;

  @Property({ columnType: 'timestamp', nullable: true })
  seenAt?: Date;

  @Property({ type: 'json' })
  payload!: NotificationPayloadMap[NotificationType];

  assignFromDomain(em: EntityManager, entity: Notification) {
    this.id = entity.id;
    this.type = entity.type;
    this.createdAt = entity.date.toDate();
    this.seenAt = entity.seenDate?.toDate();
    this.user = em.getReference(SqlUser, entity.userId);
    this.payload = entity.payload;
  }

  toDomain() {
    return new Notification({
      id: this.id,
      type: this.type,
      date: new Timestamp(this.createdAt),
      seenDate: this.seenAt ? new Timestamp(this.seenAt) : undefined,
      userId: this.user.id,
      payload: this.payload,
    });
  }
}
