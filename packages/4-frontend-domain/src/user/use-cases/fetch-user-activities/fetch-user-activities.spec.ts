import { array, UserActivityDto, UserActivityType } from 'shared';
import { mockResolve } from 'shared/test';

import { createUserActivity, TestStore } from '../../../test';

import {
  fetchUserActivities,
  selectIsFirstUserActivity,
  selectIsLoadingActivities,
  selectTotalUserActivities,
  selectUserActivities,
  setTotalUserActivities,
  setUserActivities,
} from './fetch-user-activities';

describe('fetchUserActivities', () => {
  const store = new TestStore();

  it('fetches the list of activities for the current user', async () => {
    const activities: UserActivityDto<UserActivityType>[] = [
      createUserActivity({ type: UserActivityType.signUp }),
    ];

    store.userGateway.listActivities = mockResolve({ items: activities, total: 1 });

    const promise = store.dispatch(fetchUserActivities(1));

    expect(store.select(selectIsLoadingActivities, 1)).toBe(true);
    await promise;
    expect(store.select(selectIsLoadingActivities, 1)).toBe(false);

    expect(store.userGateway.listActivities).toHaveBeenCalledWith(1);

    expect(store.select(selectUserActivities)).toEqual(activities);
    expect(store.select(selectTotalUserActivities)).toEqual(1);
  });

  it('fetches the list of activities on the second page', async () => {
    const activities: UserActivityDto<UserActivityType>[] = [
      createUserActivity({ type: UserActivityType.emailAddressValidated }),
      createUserActivity({ type: UserActivityType.signUp }),
    ];

    store.dispatch(setUserActivities({ page: 1 }, activities.slice(0, 1)));
    store.dispatch(setTotalUserActivities(1));

    store.userGateway.listActivities = mockResolve({ items: activities.slice(1, 2), total: 2 });

    await store.dispatch(fetchUserActivities(2));

    expect(store.userGateway.listActivities).toHaveBeenCalledWith(2);

    expect(store.select(selectUserActivities)).toEqual(activities);
    expect(store.select(selectTotalUserActivities)).toEqual(2);
  });

  it('does not refetch the activities when already fetched', async () => {
    store.dispatch(setUserActivities({ page: 1 }, []));
    store.userGateway.listActivities = mockResolve({ items: [], total: 0 });

    await store.dispatch(fetchUserActivities(1));

    expect(store.userGateway.listActivities).not.toHaveBeenCalled();
  });

  describe('isFirstActivity', () => {
    const activities = array(2, () => createUserActivity());

    beforeEach(() => {
      store.dispatch(setUserActivities({ page: 1 }, activities));
    });

    it('returns true when an activity is the first activity', async () => {
      expect(store.select(selectIsFirstUserActivity, activities[1])).toBe(true);
    });

    it('returns false when an activity is not the first activity', async () => {
      expect(store.select(selectIsFirstUserActivity, activities[0])).toBe(false);
    });

    it('returns false when not all activities were fetched', async () => {
      store.dispatch(setTotalUserActivities(3));
      expect(store.select(selectIsFirstUserActivity, activities[1])).toBe(false);
    });
  });
});
