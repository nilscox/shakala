import { mockResolve } from 'shared';

import { TestStore } from '../../../test';
import { createAuthUser } from '../../../test/factories';

import { fetchAuthenticatedUser } from './fetch-authenticated-user';

describe('fetchAuthenticatedUser', () => {
  const store = new TestStore();

  const user = createAuthUser({
    id: 'userId',
    nick: 'nick',
    email: 'user@domain.tld',
    signupDate: '2022-01-01',
    profileImage: 'profile.png',
  });

  it('fetches the user currently authenticated', async () => {
    store.authenticationGateway.fetchUser = mockResolve(user);

    await store.dispatch(fetchAuthenticatedUser());

    expect(store.authenticationGateway.fetchUser).toHaveBeenCalled();
    expect(store.user).toEqual(user);
  });

  it('fetches no one when the user is not authenticated', async () => {
    store.authenticationGateway.fetchUser = mockResolve(undefined);

    await store.dispatch(fetchAuthenticatedUser());

    expect(store.authenticationGateway.fetchUser).toHaveBeenCalled();
    expect(store.user).toBe(undefined);
  });
});
