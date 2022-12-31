import { UserActivityPayload, UserActivityType } from '@shakala/shared';

import { Entity, EntityProps } from '../ddd/entity';

import { Timestamp } from './timestamp.value-object';

export type UserActivityProps<Type extends UserActivityType> = EntityProps<{
  type: Type;
  date: Timestamp;
  userId: string;
  payload: UserActivityPayload[Type];
}>;

export class UserActivity<Type extends UserActivityType = UserActivityType> extends Entity<
  UserActivityProps<Type>
> {
  static create<Type extends UserActivityType>(type: Type, props: Omit<UserActivityProps<Type>, 'type'>) {
    return new UserActivity({
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

  get userId() {
    return this.props.userId;
  }

  get payload() {
    return this.props.payload;
  }
}
