import { Pagination, Timestamp } from '@shakala/common';
import {
  FindOptions,
  PERSISTENCE_TOKENS,
  SqlNotification,
  SqlRepository,
  SqlUser,
} from '@shakala/persistence';
import { NotificationType, NotificationPayloadMap } from '@shakala/shared';
import { injected } from 'brandi';

import { Notification } from '../entities/notification.entity';
import { GetNotificationsCountResult } from '../queries/get-notifications-count';
import { ListUserNotificationsResult } from '../queries/list-user-notifications';

import { NotificationRepository } from './notification.repository';

export class SqlNotificationRepository
  extends SqlRepository<Notification, SqlNotification>
  implements NotificationRepository
{
  SqlEntity = SqlNotification;

  protected toEntity(sqlNotification: SqlNotification): Notification<NotificationType> {
    return new Notification({
      id: sqlNotification.id,
      type: sqlNotification.type as NotificationType,
      date: new Timestamp(sqlNotification.createdAt),
      seenDate: sqlNotification.seenAt ? new Timestamp(sqlNotification.seenAt) : undefined,
      userId: sqlNotification.user.id,
      payload: sqlNotification.payload as NotificationPayloadMap[NotificationType],
    });
  }

  protected toSql(notification: Notification<NotificationType>): SqlNotification {
    return Object.assign(new SqlNotification(), {
      id: notification.id,
      type: notification.type,
      user: this.em.getReference(SqlUser, notification.userId),
      payload: notification.payload ?? null,
      seenAt: notification.seenDate?.toDate() ?? null,
      createdAt: notification.date.toDate(),
    });
  }

  async getNotificationsCount(userId: string, unseen: boolean): Promise<GetNotificationsCountResult> {
    const where: FindOptions<SqlNotification> = {
      user: userId,
    };

    if (unseen) {
      where.seenAt = null;
    }

    return this.repository.count(where);
  }

  async getUserNotifications(userId: string, pagination: Pagination): Promise<ListUserNotificationsResult> {
    const [sqlNotifications, total] = await this.repository.findAndCount(
      { user: userId },
      { offset: pagination.offset, limit: pagination.limit }
    );

    return {
      items: sqlNotifications.map((sqlNotification) => ({
        id: sqlNotification.id,
        type: sqlNotification.type as NotificationType,
        date: sqlNotification.createdAt.toISOString(),
        seen: sqlNotification.seenAt?.toISOString() ?? false,
        payload: sqlNotification.payload as NotificationPayloadMap[NotificationType],
      })),
      total,
    };
  }
}

injected(SqlNotificationRepository, PERSISTENCE_TOKENS.database);
