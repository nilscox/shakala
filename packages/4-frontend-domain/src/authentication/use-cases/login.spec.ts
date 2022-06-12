import { TestStore } from '../../test';
import { createAuthUser } from '../../test/factories';
import { ValidationError } from '../../types';
import {
  selectAuthenticationFieldError,
  selectAuthenticationFormError,
  selectIsAuthenticating,
  setAuthenticationFieldError,
} from '../authentication.slice';
import { selectUser } from '../user.slice';

import { login } from './login';

describe('login', () => {
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

  beforeEach(() => {
    store.authenticationGateway.login.mockResolvedValue(user);
  });

  it('logs in', async () => {
    await store.dispatch(login(email, password));

    expect(store.authenticationGateway.login).toHaveBeenCalledWith(email, password);
    expect(store.select(selectUser)).toEqual(user);
  });

  it('sets the authenticating flag', async () => {
    const promise = store.dispatch(login(email, password));

    expect(store.select(selectIsAuthenticating)).toBe(true);

    await promise;

    expect(store.select(selectIsAuthenticating)).toBe(false);
  });

  it('handles validation errors', async () => {
    store.authenticationGateway.login.mockRejectedValue(
      new ValidationError([{ field: 'email', error: 'required' }]),
    );

    await store.dispatch(login(email, password));

    expect(store.select(selectAuthenticationFieldError, 'email')).toEqual('required');
  });

  it('handles invalid credentials error', async () => {
    store.authenticationGateway.login.mockRejectedValue(new Error('InvalidCredentials'));

    await store.dispatch(login(email, password));

    expect(store.select(selectAuthenticationFormError)).toEqual('InvalidCredentials');
  });

  it('clears existing validation errors', async () => {
    store.dispatch(setAuthenticationFieldError({ field: 'password', error: 'invalid' }));

    await store.dispatch(login(email, password));

    expect(store.select(selectAuthenticationFieldError, 'password')).toBeUndefined();
  });

  it('throws when the gateway throws', async () => {
    const error = new Error();

    store.authenticationGateway.login.mockRejectedValue(error);

    await expect(store.dispatch(login(email, password))).rejects.toThrow(error);
  });
});
