import { InMemoryRepository, PaginatedItem, Pagination } from '@shakala/common';

import { Notification } from '../entities/notification.entity';
import { GetNotificationsCountResult } from '../queries/get-notifications-count';
import { ListUserNotificationsResult } from '../queries/list-user-notifications';

import { NotificationRepository } from './notification.repository';

export class InMemoryNotificationRepository
  extends InMemoryRepository<Notification>
  implements NotificationRepository
{
  entity = Notification;

  async getNotificationsCount(userId: string, unseen: boolean): Promise<GetNotificationsCountResult> {
    let notifications = this.filter((notification) => notification.userId === userId);

    if (unseen) {
      notifications = notifications.filter(({ seenDate }) => seenDate === undefined);
    }

    return notifications.length;
  }

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
