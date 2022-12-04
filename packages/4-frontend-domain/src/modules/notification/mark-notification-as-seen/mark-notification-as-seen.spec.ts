import { createTestStore, TestStore } from '../../../test-store';
import { createDate } from '../../../utils/date-utils';
import { notificationActions } from '../notification.actions';
import { notificationSelectors } from '../notification.selectors';
import { createNotification } from '../notification.types';

import { markNotificationAsSeen } from './mark-notification-as-seen';

describe('markNotificationAsSeen', () => {
  let store: TestStore;

  beforeEach(() => {
    store = createTestStore();

    const notification = createNotification({ id: 'notificationId' });
    store.dispatch(notificationActions.addNotifications([notification]));
    store.dispatch(notificationActions.setTotalUnseen(1));
    store.notificationGateway.markNotificationAsSeen.resolve();

    const now = new Date('2022-01-01');
    store.dateGateway.setNow(now);
  });

  it('marks a notification as seen', async () => {
    await store.dispatch(markNotificationAsSeen('notificationId'));

    expect(store.notificationGateway.markNotificationAsSeen.lastCall).toEqual(['notificationId']);
    expect(store.select(notificationSelectors.byId, 'notificationId')).toHaveProperty(
      'seen',
      createDate('2022-01-01'),
    );
  });

  it('decreases the total number of unseen notifications', async () => {
    await store.dispatch(markNotificationAsSeen('notificationId'));

    expect(store.select(notificationSelectors.totalUnseen)).toEqual(0);
  });

  it('logs unhandled errors', async () => {
    const error = new Error('nope');

    store.notificationGateway.markNotificationAsSeen.reject(error);

    await store.dispatch(markNotificationAsSeen('notificationId'));

    expect(store.loggerGateway.error).toHaveBeenCalledWith(error);
  });

  it('shows a snack when an unknown error happens', async () => {
    store.notificationGateway.markNotificationAsSeen.reject(new Error('nope'));

    await store.dispatch(markNotificationAsSeen('notificationId'));

    expect(store.snackbarGateway).toHaveSnack('error', "Quelque chose s'est mal passé");
  });
});
