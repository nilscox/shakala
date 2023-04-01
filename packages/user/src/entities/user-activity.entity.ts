import { Entity, EntityProps, Timestamp } from '@shakala/common';
import { UserActivityPayload, UserActivityType } from '@shakala/shared';

type UserActivityProps<Type extends UserActivityType = UserActivityType> = EntityProps<{
  type: Type;
  date: Timestamp;
  userId: string;
  payload: UserActivityPayload[Type];
}>;

export class UserActivity<Type extends UserActivityType = UserActivityType> extends Entity<
  UserActivityProps<Type>
> {
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
