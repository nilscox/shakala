import { token } from 'brandi';

import { CreateNotificationHandler } from './commands/create-notification/create-notification';
import { MarkNotificationAsSeenHandler } from './commands/mark-notification-as-seen/mark-notification-as-seen';
import { GetNotificationsCountHandler } from './queries/get-notifications-count';
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
    getNotificationsCountHandler: token<GetNotificationsCountHandler>('getNotificationsCountHandler'),
    listUserNotificationsHandler: token<ListUserNotificationsHandler>('listUserNotificationsHandler'),
  },
};
