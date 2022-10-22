import { createAction } from '@nilscox/redux-query';

import { UserActivity } from '../types';

export { setUser, unsetUser, updateUser } from './use-cases';

export const [addUserActivities, isAddUserActivitiesAction] = createAction(
  'user-activities/add',
  (activities: UserActivity[]) => ({ activities }),
);

export const [setTotalUserActivities, isSetTotalUserActivitiesAction] = createAction(
  'user-activities/set-total',
  (total: number) => ({ total }),
);
