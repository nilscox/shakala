import { Pagination } from '@shakala/common';

import { Notification } from '../entities/notification.entity';
import { GetNotificationsCountResult } from '../queries/get-notifications-count';
import { ListUserNotificationsResult } from '../queries/list-user-notifications';

export interface NotificationRepository {
  getNotificationsCount(userId: string, unseen: boolean): Promise<GetNotificationsCountResult>;
  getUserNotifications(userId: string, pagination: Pagination): Promise<ListUserNotificationsResult>;

  findByIdOrFail(notificationId: string): Promise<Notification>;
  save(notification: Notification): Promise<void>;
}
