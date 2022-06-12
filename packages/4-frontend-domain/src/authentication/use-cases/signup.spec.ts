import { TestStore } from '../../test';
import { createAuthUser } from '../../test/factories';
import { ValidationError } from '../../types';
import {
  selectAuthenticationFieldError,
  selectIsAuthenticating,
  setAuthenticationFieldError,
} from '../authentication.slice';
import { selectUser } from '../user.slice';

import { signup } from './signup';

describe('signup', () => {
  const store = new TestStore();

  const user = createAuthUser({
    id: 'userId',
    nick: 'nick',
    email: 'user@domain.tld',
    signupDate: '2022-01-01',
    profileImage: 'profile.png',
  });

  const email = 'email';
  const password = 'password';
  const nick = 'nick';

  beforeEach(() => {
    store.authenticationGateway.signup.mockResolvedValue(user);
  });

  it('signs up', async () => {
    await store.dispatch(signup(email, password, nick));

    expect(store.authenticationGateway.signup).toHaveBeenCalledWith(email, password, nick);
    expect(store.select(selectUser)).toEqual(user);
  });

  it('sets the authenticating flag', async () => {
    const promise = store.dispatch(signup(email, password, nick));

    expect(store.select(selectIsAuthenticating)).toBe(true);

    await promise;

    expect(store.select(selectIsAuthenticating)).toBe(false);
  });

  it('handles validation errors', async () => {
    store.authenticationGateway.signup.mockRejectedValue(
      new ValidationError([{ field: 'nick', error: 'already-exists' }]),
    );

    await store.dispatch(signup(email, password, nick));

    expect(store.select(selectAuthenticationFieldError, 'nick')).toEqual('already-exists');
  });

  it('clears existing validation errors', async () => {
    store.dispatch(setAuthenticationFieldError({ field: 'password', error: 'invalid' }));

    await store.dispatch(signup(email, password, nick));

    expect(store.select(selectAuthenticationFieldError, 'password')).toBeUndefined();
  });

  it('throws when the gateway throws', async () => {
    const error = new Error();

    store.authenticationGateway.signup.mockRejectedValue(error);

    await expect(store.dispatch(signup(email, password, nick))).rejects.toThrow(error);
  });
});
