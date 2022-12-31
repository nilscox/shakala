import { NotificationType } from '@shakala/shared';

import { NotificationItem } from '../notification';

import { ReplyCreatedNotification } from './reply-created-notification';
import { RulesUpdatedNotification } from './rules-updated-notification';
import { ThreadCreatedNotification } from './thread-created-notification';

export const notificationComponentMap: { [Type in NotificationType]: NotificationItem<Type> } = {
  [NotificationType.rulesUpdated]: RulesUpdatedNotification,
  [NotificationType.threadCreated]: ThreadCreatedNotification,
  [NotificationType.replyCreated]: ReplyCreatedNotification,
};
