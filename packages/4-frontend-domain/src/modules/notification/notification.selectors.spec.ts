import { createTestStore, TestStore } from '../../test-store';

import { notificationActions } from './notification.actions';
import { notificationSelectors } from './notification.selectors';
import { createNotification } from './notification.types';

const { addNotifications, setTotal } = notificationActions;

describe('notifications selectors', () => {
  let store: TestStore;

  beforeEach(() => {
    store = createTestStore();
  });

  describe('hasMore', () => {
    it('returns true when total notification > current number of notifications', () => {
      store.dispatch(addNotifications([createNotification()]));
      store.dispatch(setTotal(2));

      expect(store.select(notificationSelectors.hasMore)).toBe(true);
    });

    it('returns false when total notification = current number of notifications', () => {
      store.dispatch(addNotifications([createNotification()]));
      store.dispatch(setTotal(1));

      expect(store.select(notificationSelectors.hasMore)).toBe(false);
    });
  });
});
