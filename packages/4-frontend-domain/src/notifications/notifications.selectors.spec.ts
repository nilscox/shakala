import { createNotification, TestStore } from '../test';

import { setNotifications, setTotalNotifications } from './notifications.actions';
import { selectHasMoreNotifications } from './notifications.selectors';

describe('notifications selectors', () => {
  const store = new TestStore();

  describe('selectHasMoreNotifications', () => {
    it('returns true when total notification > current number of notifications', () => {
      store.dispatch(setNotifications([createNotification()]));
      store.dispatch(setTotalNotifications(2));

      expect(store.select(selectHasMoreNotifications)).toBe(true);
    });

    it('returns false when total notification = current number of notifications', () => {
      store.dispatch(setNotifications([createNotification()]));
      store.dispatch(setTotalNotifications(1));

      expect(store.select(selectHasMoreNotifications)).toBe(false);
    });
  });
});
