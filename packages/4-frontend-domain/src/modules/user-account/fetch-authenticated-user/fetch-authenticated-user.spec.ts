import { createTestStore, TestStore } from '../../../test-store';
import { userProfileSelectors } from '../user-profile.selectors';
import { createAuthUser } from '../user-profile.types';

import { fetchAuthenticatedUser } from './fetch-authenticated-user';

describe('fetchAuthenticatedUser', () => {
  let store: TestStore;

  beforeEach(() => {
    store = createTestStore();
  });

  it('fetches the user currently authenticated', async () => {
    const user = createAuthUser();

    store.authenticationGateway.fetchAuthenticatedUser.resolve(user);

    await store.dispatch(fetchAuthenticatedUser());

    expect(store.select(userProfileSelectors.authenticatedUser)).toEqual(user);
  });

  it('does not store the user when unauthenticated', async () => {
    store.authenticationGateway.fetchAuthenticatedUser.resolve(undefined);

    await store.dispatch(fetchAuthenticatedUser());

    expect(store.select(userProfileSelectors.authenticatedUser)).toBe(null);
  });

  it('updates the fetching flag when the user is being fetched', async () => {
    store.authenticationGateway.fetchAuthenticatedUser.resolve(undefined);

    await store.testLoadingState(fetchAuthenticatedUser(), userProfileSelectors.fetchingAuthenticatedUser);
  });
});
