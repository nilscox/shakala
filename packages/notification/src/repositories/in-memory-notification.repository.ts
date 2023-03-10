import { InMemoryRepository } from '@shakala/common';

import { Notification } from '../entities/notification.entity';

import { NotificationRepository } from './notification.repository';

export class InMemoryNotificationRepository
  extends InMemoryRepository<Notification>
  implements NotificationRepository
{
  entity = Notification;

  async getUserNotifications(userId: string): Promise<Notification[]> {
    return this.filter((notification) => notification.userId === userId);
  }
}
