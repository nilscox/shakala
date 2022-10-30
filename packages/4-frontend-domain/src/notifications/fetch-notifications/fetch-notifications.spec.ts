import { array } from 'shared';
import { mockResolve } from 'shared/test';

import { TestStore, createNotification } from '../../test';
import { addNotifications, setNotifications, setTotalNotifications } from '../notifications.actions';
import {
  selectIsLoadingNotifications,
  selectNotifications,
  selectTotalNotifications,
} from '../notifications.selectors';

import { fetchNotifications } from './fetch-notifications';

describe('fetchNotifications', () => {
  const store = new TestStore();

  it('fetches the list of notifications for the current user', async () => {
    const notifications = [createNotification()];

    store.userGateway.listNotifications = mockResolve({ items: notifications, total: 1 });

    const promise = store.dispatch(fetchNotifications(1));

    expect(store.select(selectIsLoadingNotifications)).toBe(true);
    await promise;
    expect(store.select(selectIsLoadingNotifications)).toBe(false);

    expect(store.userGateway.listNotifications).toHaveBeenCalledWith(1);

    expect(store.select(selectNotifications)).toEqual(notifications);
    expect(store.select(selectTotalNotifications)).toEqual(1);
  });

  it('fetches the list of notifications on the second page', async () => {
    const notifications = array(2, () => createNotification());

    store.dispatch(setNotifications(notifications.slice(0, 1)));
    store.dispatch(addNotifications(notifications.slice(0, 1)));
    store.userGateway.listNotifications = mockResolve({ items: notifications.slice(1, 2), total: 2 });

    await store.dispatch(fetchNotifications(2));

    expect(store.select(selectNotifications)).toEqual(notifications);
    expect(store.select(selectTotalNotifications)).toEqual(2);
  });

  it('updates the total number of notifications', async () => {
    store.userGateway.listNotifications = mockResolve({ items: [], total: 2 });
    store.dispatch(setTotalNotifications(1));

    await store.dispatch(fetchNotifications(1));

    expect(store.select(selectTotalNotifications)).toEqual(2);
  });
});
