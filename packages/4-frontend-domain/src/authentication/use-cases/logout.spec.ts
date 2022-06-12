import { TestStore } from '../../test';
import { createAuthUser } from '../../test/factories';
import { selectUser, setUser } from '../user.slice';

import { logout } from './logout';

describe('logout', () => {
  const store = new TestStore();

  beforeEach(() => {
    store.dispatch(setUser({ user: createAuthUser() }));
  });

  it('logs out', async () => {
    await store.dispatch(logout());

    expect(store.authenticationGateway.logout).toHaveBeenCalledWith();
    expect(store.select(selectUser)).toBeNull();
  });
});
