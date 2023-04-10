import { NotificationDto, UserActivityDto } from '@shakala/shared';

import { Page } from '~/utils/page';

export interface AccountPort {
  validateEmail(token: string): Promise<void>;
  getUserActivities(page?: number): Promise<Page<UserActivityDto>>;
  getNotificationsCount(): Promise<number>;
  getNotifications(page?: number): Promise<Page<NotificationDto>>;
  markNotificationAsSeen(notificationId: string): Promise<void>;
}
