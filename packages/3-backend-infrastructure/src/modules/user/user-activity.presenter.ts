import { UserActivity } from 'backend-domain';
import { UserActivityDto, UserActivityType } from 'shared';

export class UserActivityPresenter {
  static transform = <Type extends UserActivityType>(
    userActivity: UserActivity<Type>,
  ): UserActivityDto<Type> => {
    return {
      type: userActivity.type,
      date: userActivity.date.toString(),
      payload: userActivity.payload,
    };
  };
}
