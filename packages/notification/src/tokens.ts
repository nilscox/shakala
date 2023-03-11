import { token } from 'brandi';

import { CreateNotificationHandler } from './commands/create-notification/create-notification';
import { MarkNotificationAsSeenHandler } from './commands/mark-notification-as-seen/mark-notification-as-seen';
import { ListUserNotificationsHandler } from './queries/list-user-notifications';
import { NotificationRepository } from './repositories/notification.repository';

export const NOTIFICATION_TOKENS = {
  repositories: {
    notificationRepository: token<NotificationRepository>('notificationRepository'),
  },
  commands: {
    createNotificationHandler: token<CreateNotificationHandler>('createNotificationHandler'),
    markNotificationAsSeenHandler: token<MarkNotificationAsSeenHandler>('markNotificationAsSeenHandler'),
  },
  queries: {
    listUserNotificationsHandler: token<ListUserNotificationsHandler>('listUserNotificationsHandler'),
  },
};
