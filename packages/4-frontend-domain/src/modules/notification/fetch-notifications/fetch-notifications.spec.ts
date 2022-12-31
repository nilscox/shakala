import { array } from '@shakala/shared';

import { createTestStore, TestStore } from '../../../test-store';
import { notificationActions } from '../notification.actions';
import { notificationSelectors } from '../notification.selectors';
import { createNotification } from '../notification.types';

import { fetchNotifications } from './fetch-notifications';

describe('fetchNotifications', () => {
  let store: TestStore;

  beforeEach(() => {
    store = createTestStore();
  });

  it('fetches the list of notifications for the current user', async () => {
    const notifications = [createNotification()];

    store.notificationGateway.fetchNotifications.resolve({ items: notifications, total: 1 });

    await store.dispatch(fetchNotifications(1));

    expect(store.notificationGateway.fetchNotifications.lastCall).toEqual([1]);

    expect(store.select(notificationSelectors.list)).toEqual(notifications);
    expect(store.select(notificationSelectors.total)).toEqual(1);
  });

  it('updates the fetching notifications flag', async () => {
    store.notificationGateway.fetchNotifications.resolve({ items: [], total: 0 });
    await store.testLoadingState(fetchNotifications(1), notificationSelectors.isFetching);
  });

  it('fetches the list of notifications on the second page', async () => {
    const notifications = array(2, () => createNotification());

    store.dispatch(notificationActions.addNotifications(notifications.slice(0, 1)));
    store.notificationGateway.fetchNotifications.resolve({ items: notifications.slice(1, 2), total: 2 });

    await store.dispatch(fetchNotifications(2));

    expect(store.select(notificationSelectors.list)).toEqual(notifications);
    expect(store.select(notificationSelectors.total)).toEqual(2);
  });

  it('clears the existing notifications when fetching the first page', async () => {
    const notification = createNotification();

    store.dispatch(notificationActions.setNotifications([notification]));
    store.notificationGateway.fetchNotifications.resolve({ items: [], total: 0 });

    await store.dispatch(fetchNotifications(1));

    expect(store.select(notificationSelectors.list)).toEqual([]);
    expect(store.select(notificationSelectors.total)).toEqual(0);
  });

  it('logs unhandled errors', async () => {
    const error = new Error('nope');

    store.notificationGateway.fetchNotifications.reject(error);

    await store.dispatch(fetchNotifications(1));

    expect(store.loggerGateway.error).toHaveBeenCalledWith(error);
  });

  it('shows a snack when an unknown error happens', async () => {
    store.notificationGateway.fetchNotifications.reject(new Error('nope'));

    await store.dispatch(fetchNotifications(1));

    expect(store.snackbarGateway).toHaveSnack(
      'error',
      "Quelque chose s'est mal passé lors du chargement de vos notifications",
    );
  });
});
