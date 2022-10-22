import { mockResolve } from 'shared';

import { createAuthUser, TestStore } from '../../../test';

import {
  fetchAuthenticatedUser,
  selectAuthenticatedUser,
  selectIsFetchingAuthenticatedUser,
} from './fetch-authenticated-user';

describe('fetchAuthenticatedUser', () => {
  const store = new TestStore();

  it('fetches the user currently authenticated', async () => {
    const user = createAuthUser();

    store.authenticationGateway.fetchUser = mockResolve(user);

    await store.dispatch(fetchAuthenticatedUser());

    expect(store.authenticationGateway.fetchUser).toHaveBeenCalled();
    expect(store.select(selectAuthenticatedUser)).toEqual(user);
    expect(store.select(selectIsFetchingAuthenticatedUser)).toBe(false);
  });

  it('fetches no one when the user is not authenticated', async () => {
    store.authenticationGateway.fetchUser = mockResolve(undefined);

    await store.dispatch(fetchAuthenticatedUser());

    expect(store.select(selectAuthenticatedUser)).toBe(undefined);
    expect(store.select(selectIsFetchingAuthenticatedUser)).toBe(false);
  });
});
