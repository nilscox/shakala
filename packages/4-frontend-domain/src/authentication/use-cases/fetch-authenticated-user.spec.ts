import { TestStore } from '../../test';
import { createAuthUser } from '../../test/factories';
import { selectUser } from '../user.slice';

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
    store.authenticationGateway.fetchUser.mockResolvedValue(user);

    await store.dispatch(fetchAuthenticatedUser());

    expect(store.authenticationGateway.fetchUser).toHaveBeenCalled();
    expect(store.select(selectUser)).toEqual(user);
  });

  it('fetches no one when the user is not authenticated', async () => {
    store.authenticationGateway.fetchUser.mockResolvedValue(undefined);

    await store.dispatch(fetchAuthenticatedUser());

    expect(store.authenticationGateway.fetchUser).toHaveBeenCalled();
    expect(store.select(selectUser)).toBeNull();
  });
});
