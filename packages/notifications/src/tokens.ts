import { token } from 'brandi';

import { CreateNotificationHandler } from './commands/create-notification';
import { NotificationRepository } from './repositories/notification.repository';

export const NOTIFICATION_TOKENS = {
  repositories: {
    notificationRepository: token<NotificationRepository>('notificationRepository'),
  },
  commands: {
    createNotificationHandler: token<CreateNotificationHandler>('createNotificationHandler'),
  },
};
