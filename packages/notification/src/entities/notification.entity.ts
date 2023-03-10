import { EntityProps, Timestamp, Entity } from '@shakala/common';

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

type NotificationProps<Type extends NotificationType> = EntityProps<{
  type: Type;
  date: Timestamp;
  seenDate?: Timestamp;
  userId: string;
  payload: NotificationPayloadMap[Type];
}>;

export class Notification<Type extends NotificationType = NotificationType> extends Entity<
  NotificationProps<Type>
> {
  get type() {
    return this.props.type;
  }

  get date() {
    return this.props.date;
  }

  get seenDate() {
    return this.props.seenDate;
  }

  setSeenDate(date: Timestamp) {
    this.props.seenDate = date;
  }

  get userId() {
    return this.props.userId;
  }

  get payload() {
    return this.props.payload;
  }
}
