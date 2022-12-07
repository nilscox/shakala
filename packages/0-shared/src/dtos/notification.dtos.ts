import { randomId } from '../libs';

import { UserDto } from './thread.dtos';

export enum NotificationType {
  rulesUpdated = 'rulesUpdated',
  threadCreated = 'threadCreated',
  replyCreated = 'replyCreated',
}

export type NotificationPayloadMap = {
  [NotificationType.rulesUpdated]: {
    version: string;
    changes: string;
  };

  [NotificationType.threadCreated]: {
    threadId: string;
    author: UserDto;
    text: string;
  };

  [NotificationType.replyCreated]: {
    threadId: string;
    threadDescription: string;
    parentId: string;
    parentAuthor: UserDto;
    replyId: string;
    replyAuthor: UserDto;
    text: string;
  };
};

export type NotificationDto<Type extends NotificationType = NotificationType> = {
  id: string;
  date: string;
  seen: string | false;
  type: Type;
  payload: NotificationPayloadMap[Type];
};

export const createNotificationDto = <Type extends NotificationType>(
  overrides?: Partial<NotificationDto<Type>>,
): NotificationDto<NotificationType> => ({
  id: randomId(),
  date: '',
  seen: false,
  type: NotificationType.rulesUpdated,
  payload: { version: '', changes: '' },
  ...overrides,
});
