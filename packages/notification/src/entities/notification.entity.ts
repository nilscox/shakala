import { Entity, EntityProps, Timestamp } from '@shakala/common';
import { NotificationPayloadMap, NotificationType } from '@shakala/shared';

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
