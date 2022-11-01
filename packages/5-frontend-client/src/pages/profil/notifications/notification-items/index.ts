import { NotificationType } from 'shared';

import { NotificationItem } from '../notification';

import { RulesUpdatedNotification } from './rules-updated-notification';
import { ThreadCreatedNotification } from './thread-created-notification';

export const notificationComponentMap: { [Type in NotificationType]: NotificationItem<Type> } = {
  [NotificationType.rulesUpdated]: RulesUpdatedNotification,
  [NotificationType.threadCreated]: ThreadCreatedNotification,
};
