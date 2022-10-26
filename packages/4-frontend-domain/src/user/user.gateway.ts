import { Notification, Paginated, UserActivity } from '../types';

export interface UserGateway {
  changeProfileImage(image: File): Promise<string>;
  listActivities(page: number): Promise<Paginated<UserActivity>>;
  listNotifications(page: number): Promise<Paginated<Notification>>;
  getNotificationsCount(): Promise<number>;
  markNotificationAsSeen(notificationId: string): Promise<void>;
}
