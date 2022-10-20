import { mockResolve, UserActivityDto, UserActivityType } from 'shared';

import { createUserActivity, TestStore } from '../../../test';
import { addUserActivities, setTotalUserActivities } from '../../user.actions';
import { selectTotalUserActivities, selectUserActivities } from '../../user.selectors';

import { fetchUserActivities } from './fetch-user-activities';

describe('fetchUserActivities', () => {
  const store = new TestStore();

  it('fetches the list of activities for the current user', async () => {
    const activities: UserActivityDto<UserActivityType>[] = [
      createUserActivity({ type: UserActivityType.signUp }),
    ];

    store.userGateway.listActivities = mockResolve({ items: activities, total: 1 });

    await store.dispatch(fetchUserActivities(1));

    expect(store.userGateway.listActivities).toHaveBeenCalledWith(1);

    expect(store.select(selectUserActivities)).toEqual(activities);
    expect(store.select(selectTotalUserActivities)).toEqual(1);
  });

  it('fetches the list of activities on the second page', async () => {
    const activities: UserActivityDto<UserActivityType>[] = [
      createUserActivity({ type: UserActivityType.emailAddressValidated }),
      createUserActivity({ type: UserActivityType.signUp }),
    ];

    store.dispatch(addUserActivities(activities.slice(1)));
    store.dispatch(setTotalUserActivities(1));

    store.userGateway.listActivities = mockResolve({ items: activities.slice(0, 1), total: 2 });

    await store.dispatch(fetchUserActivities(2));

    expect(store.userGateway.listActivities).toHaveBeenCalledWith(2);

    expect(store.select(selectUserActivities)).toEqual(activities);
    expect(store.select(selectTotalUserActivities)).toEqual(2);
  });
});
