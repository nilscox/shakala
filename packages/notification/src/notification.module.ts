import { Module } from '@shakala/common';
import { Container } from 'brandi';

import { CreateNotificationHandler } from './commands/create-notification/create-notification';
import { MarkNotificationAsSeenHandler } from './commands/mark-notification-as-seen/mark-notification-as-seen';
import { GetNotificationsCountHandler } from './queries/get-notifications-count';
import { ListUserNotificationsHandler } from './queries/list-user-notifications';
import { SqlNotificationRepository } from './repositories/sql-notification.repository';
import { NOTIFICATION_TOKENS } from './tokens';

class NotificationModule extends Module {
  init(container: Container): void {
    this.expose(container, NOTIFICATION_TOKENS.commands);
    this.expose(container, NOTIFICATION_TOKENS.queries);
  }
}

export const module = new NotificationModule();

module.bind(NOTIFICATION_TOKENS.repositories.notificationRepository).toInstance(SqlNotificationRepository).inSingletonScope();

module.bind(NOTIFICATION_TOKENS.commands.markNotificationAsSeenHandler).toInstance(MarkNotificationAsSeenHandler).inSingletonScope();
module.bind(NOTIFICATION_TOKENS.commands.createNotificationHandler).toInstance(CreateNotificationHandler).inSingletonScope();

module.bind(NOTIFICATION_TOKENS.queries.getNotificationsCountHandler).toInstance(GetNotificationsCountHandler).inSingletonScope();
module.bind(NOTIFICATION_TOKENS.queries.listUserNotificationsHandler).toInstance(ListUserNotificationsHandler).inSingletonScope();
