import { AuthorizationErrorReason } from 'shared';
import { mockReject, mockResolve } from 'shared/test';

import { TestStore } from '../../../test';
import { createAuthUser } from '../../../test/factories';
import { AuthorizationError, ValidationError } from '../../../types';
import { setAuthenticationFieldError } from '../../authentication.actions';
import { InvalidCredentialsError } from '../../authentication.gateway';
import {
  selectAuthenticationFieldError,
  selectAuthenticationFormError,
  selectIsAuthenticating,
} from '../../authentication.selectors';
import { AuthenticationField, AuthenticationType } from '../../authentication.types';

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
    store.routerGateway.currentAuthenticationForm = AuthenticationType.login;
    store.authenticationGateway.login = mockResolve(user);
  });

  it('logs in', async () => {
    await store.dispatch(login(email, password));

    expect(store.authenticationGateway.login).toHaveBeenCalledWith(email, password);
    expect(store.user).toEqual(user);
  });

  it('sets the authenticating flag', async () => {
    const promise = store.dispatch(login(email, password));

    expect(store.select(selectIsAuthenticating)).toBe(true);

    await promise;

    expect(store.select(selectIsAuthenticating)).toBe(false);
  });

  it('closes the authentication modal', async () => {
    await store.dispatch(login(email, password));

    expect(store.routerGateway.currentAuthenticationForm).toBe(undefined);
  });

  it('shows a snackbar', async () => {
    await store.dispatch(login(email, password));

    expect(store.snackbarGateway.success).toHaveBeenCalledWith('Vous êtes maintenant connecté(e)');
  });

  it('redirects to a previously saved authenticated location', async () => {
    store.routerGateway.afterAuthenticationRedirection = '/profil';

    await store.dispatch(login(email, password));

    expect(store.routerGateway.pathname).toEqual('/profil');
  });

  it('handles validation errors', async () => {
    store.authenticationGateway.login = mockReject(
      new ValidationError([{ field: 'email', error: 'required', value: null }]),
    );

    await store.dispatch(login(email, password));

    expect(store.select(selectAuthenticationFieldError, AuthenticationField.email)).toEqual('required');
  });

  it('handles invalid credentials error', async () => {
    store.authenticationGateway.login = mockReject(new InvalidCredentialsError());

    await store.dispatch(login(email, password));

    expect(store.select(selectAuthenticationFormError)).toEqual('InvalidCredentials');
  });

  it('shows a snack when the user is already authenticated', async () => {
    store.authenticationGateway.login = mockReject(
      new AuthorizationError(AuthorizationErrorReason.authenticated),
    );

    await store.dispatch(login(email, password));

    expect(store.snackbarGateway.warning).toHaveBeenCalledWith('Vous êtes déjà connecté(e)');
  });

  it('clears existing validation errors', async () => {
    store.dispatch(setAuthenticationFieldError(AuthenticationField.password, 'invalid'));

    await store.dispatch(login(email, password));

    expect(store.select(selectAuthenticationFieldError, AuthenticationField.password)).toBe(undefined);
  });

  it('throws when the gateway throws', async () => {
    const error = new Error();

    store.authenticationGateway.login = mockReject(error);

    await expect.rejects(store.dispatch(login(email, password))).with(error);
    expect(store.snackbarGateway.error).toHaveBeenCalledWith("Une erreur s'est produite");
  });
});
