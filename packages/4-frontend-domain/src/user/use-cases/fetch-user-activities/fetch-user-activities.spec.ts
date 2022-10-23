import { array, mockResolve, UserActivityDto, UserActivityType } from 'shared';
import Sinon, { SinonFakeTimers } from 'sinon';

import { createDate, createUserActivity, TestStore } from '../../../test';

import {
  fetchUserActivities,
  formatActivityDate,
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

  describe('formatActivityDate', () => {
    let clock: SinonFakeTimers;

    beforeEach(() => {
      clock = Sinon.useFakeTimers();
      clock.setSystemTime(new Date('2022-01-02T12:00'));
    });

    afterEach(() => {
      clock.restore();
    });

    it('returns a distance to now when the activity was created within 24 hours', () => {
      const formatted = formatActivityDate(createUserActivity({ date: createDate('2022-01-02T10:00') }));

      expect(formatted).toEqual('Il y a environ 2 heures');
    });

    it('returns the formatted date when the activity was created more than 24 hours ago', () => {
      const formatted = formatActivityDate(createUserActivity({ date: createDate('2022-01-01T10:00') }));

      expect(formatted).toEqual('Le 1 janvier 2022');
    });
  });
});
