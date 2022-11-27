import { createTestStore, TestStore } from '../../../test-store';
import { routerActions, routerSelectors } from '../../router';
import { createAuthUser } from '../../user-account';

import { logout } from './logout';

describe('logout', () => {
  let store: TestStore;

  beforeEach(() => {
    store = createTestStore();
  });

  beforeEach(() => {
    store.user = createAuthUser();
    store.dispatch(routerActions.setPathname('/profile'));
    store.authenticationGateway.logout.resolve();
  });

  it('logs out', async () => {
    await store.dispatch(logout());

    expect(store.user).toBe(null);
  });

  it('redirects to the home page', async () => {
    await store.dispatch(logout());

    expect(store.select(routerSelectors.pathname)).toEqual('/');
  });

  it('shows a snackbar', async () => {
    await store.dispatch(logout());

    expect(store.snackbarGateway).toHaveSuccessMessage("Vous n'êtes maintenant plus connecté(e)");
  });
});
