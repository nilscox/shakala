import { createAction } from '@nilscox/redux-query';

import { AuthUser, UserActivity } from '../types';

export const [setUser, isSetUserAction] = createAction('user/set', (user: AuthUser) => ({
  user,
}));

export const [unsetUser, isUnsetUserAction] = createAction('user/unset');

export const [updateUser, isUpdateUserAction] = createAction('user/update', (changes: Partial<AuthUser>) => ({
  changes,
}));

export const [addUserActivities, isAddUserActivitiesAction] = createAction(
  'user-activities/add',
  (activities: UserActivity[]) => ({ activities }),
);

export const [setTotalUserActivities, isSetTotalUserActivitiesAction] = createAction(
  'user-activities/set-total',
  (total: number) => ({ total }),
);
