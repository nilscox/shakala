import { Notification } from '../entities/notification.entity';

export interface NotificationRepository {
  getUserNotifications(userId: string): Promise<Notification[]>;

  save(notification: Notification): Promise<void>;
}
