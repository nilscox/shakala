import { AuthorizationErrorReason } from 'shared';

import { InvalidCredentialsError } from '../../../gateways/authentication-gateway';
import { createTestStore, TestStore } from '../../../test-store';
import { ValidationErrors } from '../../../utils/validation-error';
import { AuthorizationError } from '../../authorization';
import { routerActions, routerSelectors } from '../../router';
import { AuthUser, createAuthUser } from '../../user-account';
import { authenticationSelectors } from '../authentication.selectors';
import { AuthenticationFormType } from '../authentication.types';
import { setCurrentAuthenticationForm } from '../require-authentication/require-authentication';

import { login } from './login';

describe('login', () => {
  let store: TestStore;
  let user: AuthUser;

  beforeEach(() => {
    store = createTestStore();

    user = createAuthUser({
      id: 'userId',
      nick: 'nick',
      email: 'user@domain.tld',
      signupDate: '2022-01-01',
      profileImage: 'profile.png',
    });

    store.dispatch(setCurrentAuthenticationForm(AuthenticationFormType.login));
    store.authenticationGateway.login.resolve(user);
  });

  it('authenticate with an email and a password', async () => {
    await store.dispatch(login('email', 'password'));

    expect(store.user).toEqual(user);
  });

  it('closes the authentication dialog', async () => {
    await store.dispatch(login('email', 'password'));

    expect(store.select(authenticationSelectors.isModalOpen)).toBe(false);
  });

  it('shows a snackbar', async () => {
    await store.dispatch(login('email', 'password'));

    expect(store.snackbarGateway).toHaveSnack('success', 'Vous êtes maintenant connecté(e)');
  });

  it.skip('redirects to a previously saved restricted location', async () => {
    store.dispatch(routerActions.setQueryParam(['next', '/profil']));

    await store.dispatch(login('email', 'password'));

    expect(store.select(routerSelectors.pathname)).toEqual('/profil');
  });

  it('throws validation errors', async () => {
    const error = new ValidationErrors({});

    store.authenticationGateway.login.reject(error);

    await expect.rejects(store.dispatch(login('email', 'password'))).with(error);
  });

  it('throws invalid credentials errors', async () => {
    const error = new InvalidCredentialsError();

    store.authenticationGateway.login.reject(error);

    await expect.rejects(store.dispatch(login('email', 'password'))).with(error);
  });

  it('shows a snack when the user is already authenticated', async () => {
    store.authenticationGateway.login.reject(new AuthorizationError(AuthorizationErrorReason.authenticated));

    await store.dispatch(login('email', 'password'));

    expect(store.snackbarGateway).toHaveSnack('warning', 'Vous êtes déjà connecté(e)');
  });

  it('shows a fallback error message when the error is not handled', async () => {
    const error = new Error('nope');

    store.authenticationGateway.login.reject(error);

    await store.dispatch(login('email', 'password'));

    expect(store.snackbarGateway).toHaveSnack('error', "Une erreur s'est produite");
  });
});
