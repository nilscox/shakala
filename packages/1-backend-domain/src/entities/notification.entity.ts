import { NotificationPayloadMap, NotificationType } from 'shared';

import { AggregateRoot } from '../ddd/aggregate-root';
import { EntityProps } from '../ddd/entity';

import { Timestamp } from './timestamp.value-object';

type NotificationProps<Type extends NotificationType> = EntityProps<{
  type: Type;
  date: Timestamp;
  seenDate?: Timestamp;
  userId: string;
  payload: NotificationPayloadMap[Type];
}>;

export class Notification<Type extends NotificationType = NotificationType> extends AggregateRoot<
  NotificationProps<Type>
> {
  static create<Type extends NotificationType>(type: Type, props: Omit<NotificationProps<Type>, 'type'>) {
    return new Notification({
      type,
      ...props,
    });
  }

  get type() {
    return this.props.type;
  }

  get date() {
    return this.props.date;
  }

  get seenDate() {
    return this.props.seenDate;
  }

  // todo: inject a date adapter
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
