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
    author: {
      id: string;
      nick: string;
      profileImage?: string;
    };
    text: string;
  };

  [NotificationType.replyCreated]: {
    threadId: string;
    threadDescription: string;
    parentId: string;
    parentAuthor: {
      id: string;
      nick: string;
      profileImage?: string;
    };
    replyId: string;
    replyAuthor: {
      id: string;
      nick: string;
      profileImage?: string;
    };
    text: string;
  };
};

export type NotificationDto<Type extends NotificationType = NotificationType> = {
  id: string;
  type: Type;
  date: string;
  seen: string | false;
  payload: NotificationPayloadMap[Type];
};
