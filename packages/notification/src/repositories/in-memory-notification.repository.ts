import { InMemoryRepository } from '@shakala/common';

import { Notification } from '../entities/notification.entity';
import { ListUserNotificationsResult } from '../queries/list-user-notifications';

import { NotificationRepository } from './notification.repository';

export class InMemoryNotificationRepository
  extends InMemoryRepository<Notification>
  implements NotificationRepository
{
  entity = Notification;

  async getUserNotifications(userId: string): Promise<ListUserNotificationsResult> {
    return this.filter((notification) => notification.userId === userId).map((notification) => ({
      id: notification.id,
      type: notification.type,
      created: notification.date.toString(),
      seen: notification.seenDate?.toString() ?? false,
      payload: notification.payload,
    }));
  }
}
