import { AuthorizationErrorReason } from 'shared';

import { createTestStore, TestStore } from '../../../test-store';
import { ValidationErrors } from '../../../utils/validation-error';
import { AuthorizationError } from '../../authorization';
import { routerActions, routerSelectors } from '../../router';
import { AuthUser, createAuthUser } from '../../user-account';
import { authenticationSelectors } from '../authentication.selectors';
import { AuthenticationFormType } from '../authentication.types';
import { setAuthenticationForm } from '../require-authentication/require-authentication';

import { signup } from './signup';

describe('signup', () => {
  let store: TestStore;
  let user: AuthUser;

  beforeEach(() => {
    store = createTestStore();

    store.dispatch(setAuthenticationForm(AuthenticationFormType.signup));

    user = createAuthUser({
      id: 'userId',
      nick: 'nick',
      email: 'user@domain.tld',
      signupDate: new Date('2022-01-01').toISOString(),
      profileImage: undefined,
    });

    store.authenticationGateway.signup.resolve(user.id);
  });

  it('creates a new account', async () => {
    store.dateGateway.setNow(new Date('2022-01-01'));

    await store.dispatch(signup('user@domain.tld', 'password', 'nick'));

    expect(store.user).toEqual(user);
  });

  it('closes the authentication modal', async () => {
    await store.dispatch(signup('email', 'password', 'nick'));

    expect(store.select(authenticationSelectors.isModalOpen)).toBe(false);
  });

  it('shows a snackbar', async () => {
    await store.dispatch(signup('email', 'password', 'nick'));

    expect(store.snackbarGateway).toHaveSnack(
      'success',
      `Votre compte a bien été créé ! Un email de validation a été envoyé à l'adresse email.`,
    );
  });

  it.skip('redirects to a previously saved authenticated location', async () => {
    store.dispatch(routerActions.setQueryParam(['next', '/profil']));

    await store.dispatch(signup('email', 'password', 'nick'));

    expect(store.select(routerSelectors.pathname)).toEqual('/profil');
  });

  it('handles validation errors', async () => {
    const error = new ValidationErrors({});

    store.authenticationGateway.signup.reject(error);

    await expect.rejects(store.dispatch(signup('email', 'password', 'nick'))).with(error);
  });

  it('shows a snack when the user is already authenticated', async () => {
    store.authenticationGateway.signup.reject(new AuthorizationError(AuthorizationErrorReason.authenticated));

    await store.dispatch(signup('email', 'password', 'nick'));

    expect(store.snackbarGateway).toHaveSnack('warning', 'Vous êtes déjà connecté(e)');
  });

  it('logs unhandled errors', async () => {
    const error = new Error('nope');

    store.authenticationGateway.signup.reject(error);

    await store.dispatch(signup('nick', 'email', 'password'));

    expect(store.loggerGateway.error).toHaveBeenCalledWith(error);
  });

  it('shows a fallback error message when the error is not handled', async () => {
    const error = new Error('nope');

    store.authenticationGateway.signup.reject(error);

    await store.dispatch(signup('nick', 'email', 'password'));

    expect(store.snackbarGateway).toHaveSnack('error', "Une erreur s'est produite");
  });
});
