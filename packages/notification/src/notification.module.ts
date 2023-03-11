import { Module } from '@shakala/common';

import { CreateNotificationHandler } from './commands/create-notification';
import { ListUserNotificationsHandler } from './queries/list-user-notifications';
import { FilesystemNotificationRepository } from './repositories/file-system-notification.repository';
import { InMemoryNotificationRepository } from './repositories/in-memory-notification.repository';
import { NOTIFICATION_TOKENS } from './tokens';

type NotificationModuleConfig = {
  repositories: 'memory' | 'filesystem';
};

export class NotificationModule extends Module {
  configure(config: NotificationModuleConfig): void {
    if (config.repositories === 'memory') {
      this.bindToken(NOTIFICATION_TOKENS.repositories.notificationRepository, InMemoryNotificationRepository);
    } else {
      this.bindToken(
        NOTIFICATION_TOKENS.repositories.notificationRepository,
        FilesystemNotificationRepository
      );
    }

    this.bindToken(NOTIFICATION_TOKENS.commands.createNotificationHandler, CreateNotificationHandler);
    this.bindToken(NOTIFICATION_TOKENS.queries.listUserNotificationsHandler, ListUserNotificationsHandler);
  }
}
