import { array } from 'shared';
import { mockResolve } from 'shared/test';

import { createNotification, TestStore } from '../../../test';

import {
  fetchNotifications,
  selectIsLoadingNotifications,
  selectNotifications,
  selectTotalNotifications,
  setNotifications,
} from './fetch-notifications';

describe('fetchNotifications', () => {
  const store = new TestStore();

  it('fetches the list of notifications for the current user', async () => {
    const notifications = [createNotification()];

    store.userGateway.listNotifications = mockResolve({ items: notifications, total: 1 });

    const promise = store.dispatch(fetchNotifications(1));

    expect(store.select(selectIsLoadingNotifications, 1)).toBe(true);
    await promise;
    expect(store.select(selectIsLoadingNotifications, 1)).toBe(false);

    expect(store.userGateway.listNotifications).toHaveBeenCalledWith(1);

    expect(store.select(selectNotifications)).toEqual(notifications);
    expect(store.select(selectTotalNotifications)).toEqual(1);
  });

  it('fetches the list of notifications on he second page', async () => {
    const notifications = array(2, () => createNotification());

    store.dispatch(setNotifications({ page: 1 }, notifications.slice(0, 1)));
    store.userGateway.listNotifications = mockResolve({ items: notifications.slice(1, 2), total: 2 });

    await store.dispatch(fetchNotifications(2));

    expect(store.select(selectNotifications)).toEqual(notifications);
    expect(store.select(selectTotalNotifications)).toEqual(2);
  });

  it('does not fetch the notifications when already fetched', async () => {
    store.dispatch(setNotifications({ page: 1 }, []));

    store.userGateway.listNotifications = mockResolve({ items: [], total: 0 });

    await store.dispatch(fetchNotifications(1));

    expect(store.userGateway.listNotifications).not.toHaveBeenCalled();
  });
});
