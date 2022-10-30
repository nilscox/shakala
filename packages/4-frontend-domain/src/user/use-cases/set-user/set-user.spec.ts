import { createAuthUser, TestStore } from '../../../test';
import { selectUser, selectUserUnsafe } from '../../user.selectors';

import { setUser, unsetUser, updateUser } from './set-user';

describe('authenticated user', () => {
  describe('setUser', () => {
    const store = new TestStore();

    it('sets the authenticated user', () => {
      const user = createAuthUser();

      store.dispatch(setUser(user));

      expect(store.select(selectUser)).toEqual(user);
    });
  });

  describe('unsetUser', () => {
    const store = new TestStore();

    it('unsets the authenticated user', () => {
      const user = createAuthUser();

      store.dispatch(setUser(user));
      store.dispatch(unsetUser());

      expect(store.select(selectUserUnsafe)).toBe(undefined);
    });
  });

  describe('updateUser', () => {
    const store = new TestStore();

    it('updates the authenticated user', () => {
      const user = createAuthUser();

      store.dispatch(setUser(user));
      store.dispatch(updateUser({ profileImage: 'new image' }));

      expect(store.select(selectUser)).toHaveProperty('profileImage', 'new image');
    });
  });
});
