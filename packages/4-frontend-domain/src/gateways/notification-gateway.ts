import { Notification } from '../modules/notification';
import { Paginated } from '../utils/pagination';

export interface NotificationGateway {
  fetchNotifications(count: number): Promise<Paginated<Notification>>;
  fetchUnseenNotificationsCount(): Promise<number>;
  markNotificationAsSeen(notificationId: string): Promise<void>;
}
