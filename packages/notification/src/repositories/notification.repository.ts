import { Notification } from '../entities/notification.entity';
import { ListUserNotificationsResult } from '../queries/list-user-notifications';

export interface NotificationRepository {
  getUserNotifications(userId: string): Promise<ListUserNotificationsResult>;

  findByIdOrFail(notificationId: string): Promise<Notification>;
  save(notification: Notification): Promise<void>;
}
