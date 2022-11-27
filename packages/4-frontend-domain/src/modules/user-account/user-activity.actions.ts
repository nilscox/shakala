import { EntityActions, EntityAdapter } from '@nilscox/redux-kooltik';

import { fetchUserActivities } from './fetch-user-activities/fetch-user-activities';
import { UserActivity } from './user-activity.types';

export type UserActivityMeta = {
  fetching: boolean;
  error?: unknown;
  total: number;
};

class UserActivityActions extends EntityActions<UserActivity, UserActivityMeta> {
  private adapter = new EntityAdapter<UserActivity>((activity) => activity.id);

  constructor() {
    super('user-activity', {
      fetching: false,
      total: 0,
    });
  }

  setFetching = this.createSetter('fetching');
  setError = this.createSetter('error');
  setTotal = this.createSetter('total');

  addMany = this.action('add-activities', this.adapter.addMany);

  fetchActivities = fetchUserActivities;
}

export const userActivityActions = new UserActivityActions();
