import { InMemoryRepository, PaginatedItem, Pagination } from '@shakala/common';

import { Notification } from '../entities/notification.entity';
import { ListUserNotificationsResult } from '../queries/list-user-notifications';

import { NotificationRepository } from './notification.repository';

export class InMemoryNotificationRepository
  extends InMemoryRepository<Notification>
  implements NotificationRepository
{
  entity = Notification;

  async getUserNotifications(userId: string, pagination: Pagination): Promise<ListUserNotificationsResult> {
    const notifications = this.filter((notification) => notification.userId === userId);

    const results: Array<PaginatedItem<ListUserNotificationsResult>> = notifications.map((notification) => ({
      id: notification.id,
      type: notification.type,
      created: notification.date.toString(),
      seen: notification.seenDate?.toString() ?? false,
      payload: notification.payload,
    }));

    return this.paginate(results, pagination);
  }
}
