import { mockResolve } from 'shared';

import { TestStore } from '../../../test';
import { createAuthUser } from '../../../test/factories';

import { logout } from './logout';

describe('logout', () => {
  const store = new TestStore();

  beforeEach(() => {
    store.user = createAuthUser();
    store.routerGateway.pathname = '/profile';
    store.authenticationGateway.logout = mockResolve();
  });

  it('logs out', async () => {
    await store.dispatch(logout());

    expect(store.authenticationGateway.logout).toHaveBeenCalledWith();
    expect(store.user).toBeDefined();

    store.timerGateway.invokeTimeout();

    expect(store.user).toBe(undefined);
  });

  it('redirects to the home page', async () => {
    await store.dispatch(logout());

    expect(store.routerGateway.pathname).toEqual('/');
  });

  it('shows a snackbar', async () => {
    await store.dispatch(logout());

    expect(store.snackbarGateway.success).toHaveBeenCalledWith("Vous n'êtes maintenant plus connecté(e)");
  });
});
