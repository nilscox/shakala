import { EntitySelectors } from '@nilscox/redux-kooltik';
import { createSelector } from 'reselect';
import { last } from 'shared';

import { AppState } from '../../store';

import { UserActivityMeta } from './user-activity.actions';
import { UserActivity } from './user-activity.types';

class UserActivitySelectors extends EntitySelectors<AppState, UserActivity, UserActivityMeta> {
  constructor() {
    super('user-activity', (state) => state.userAccount.activity);
  }

  isFetching = this.propertySelector('fetching');
  error = this.propertySelector('error');
  total = this.propertySelector('total');

  all = createSelector(this.entitiesSelector(), Object.values);

  hasMore = createSelector([this.all, this.total], (activities, total) => {
    return activities.length < total;
  });

  isFirst = createSelector(
    [this.all, this.hasMore, (state, activity: UserActivity) => activity],
    (activities, hasMore, activity) => {
      if (hasMore) {
        return false;
      }

      return last(activities).id === activity.id;
    },
  );
}

export const userActivitySelectors = new UserActivitySelectors();
