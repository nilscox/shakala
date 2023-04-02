import { NotificationDto, NotificationType } from '@shakala/shared';

import { ReplyCreatedNotification } from './reply-created-notification';
import { RulesUpdatedNotification } from './rules-updated-notification';
import { ThreadCreatedNotification } from './thread-created-notification';

export const notificationComponentMap: {
  [Type in NotificationType]: React.ComponentType<{ notification: NotificationDto<Type> }>;
} = {
  [NotificationType.rulesUpdated]: RulesUpdatedNotification,
  [NotificationType.threadCreated]: ThreadCreatedNotification,
  [NotificationType.replyCreated]: ReplyCreatedNotification,
};
