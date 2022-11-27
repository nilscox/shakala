import { array } from 'shared';

import { createTestStore, TestStore } from '../../../test-store';
import { userActivityActions } from '../user-activity.actions';
import { userActivitySelectors } from '../user-activity.selectors';
import { createUserActivity } from '../user-activity.types';

import { fetchUserActivities } from './fetch-user-activities';

describe('fetchUserActivities', () => {
  let store: TestStore;

  beforeEach(() => {
    store = createTestStore();
  });

  it('retrieves the list of activities for the current user', async () => {
    const activity = createUserActivity();

    store.userProfileGateway.fetchActivities.resolve({ items: [activity], total: 1 });

    await store.dispatch(fetchUserActivities(1));

    expect(store.select(userActivitySelectors.all)).toEqual([activity]);
    expect(store.select(userActivitySelectors.total)).toEqual(1);
  });

  it('retrieves the list of activities on the second page', async () => {
    const [activity1, activity2] = array(2, () => createUserActivity());

    store.dispatch(userActivityActions.addMany([activity1]));
    store.dispatch(userActivityActions.setTotal(1));

    store.userProfileGateway.fetchActivities.resolve({ items: [activity2], total: 2 });

    await store.dispatch(fetchUserActivities(2));

    expect(store.select(userActivitySelectors.all)).toEqual([activity1, activity2]);
    expect(store.select(userActivitySelectors.total)).toEqual(2);
  });

  it('stores the error when the gateway throws', async () => {
    store.userProfileGateway.fetchActivities.reject(new Error('nope'));

    await store.dispatch(fetchUserActivities(1));

    expect(store.select(userActivitySelectors.error)).toHaveProperty('message', 'nope');
  });

  describe('isFirstActivity', () => {
    const activities = array(2, () => createUserActivity());

    beforeEach(() => {
      store.dispatch(userActivityActions.addMany(activities));
    });

    it('returns true when an activity is the first activity', async () => {
      expect(store.select(userActivitySelectors.isFirst, activities[1])).toBe(true);
    });

    it('returns false when an activity is not the first activity', async () => {
      expect(store.select(userActivitySelectors.isFirst, activities[0])).toBe(false);
    });

    it('returns false when not all activities were fetched', async () => {
      store.dispatch(userActivityActions.setTotal(3));
      expect(store.select(userActivitySelectors.isFirst, activities[1])).toBe(false);
    });
  });
});
