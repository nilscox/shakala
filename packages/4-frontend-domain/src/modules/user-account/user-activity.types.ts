import { randomId, UserActivityDto, UserActivityPayload, UserActivityType } from '@shakala/shared';

export type UserActivity<Type extends UserActivityType = UserActivityType> = UserActivityDto<Type>;

export const createUserActivity = <Type extends UserActivityType>(
  overrides: Partial<UserActivity<Type>> = {},
): UserActivity<Type> => ({
  id: randomId(),
  type: '' as Type,
  date: '',
  payload: {} as UserActivityPayload[Type],
  ...overrides,
});
