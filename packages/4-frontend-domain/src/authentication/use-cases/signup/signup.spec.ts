import { AuthorizationErrorReason, mockReject, mockResolve } from 'shared';

import { TestStore } from '../../../test';
import { createAuthUser } from '../../../test/factories';
import { AuthorizationError, ValidationError } from '../../../types';
import { setAuthenticationFieldError } from '../../authentication.actions';
import { selectAuthenticationFieldError, selectIsAuthenticating } from '../../authentication.selectors';
import { AuthenticationField, AuthenticationType } from '../../authentication.types';

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
    store.routerGateway.currentAuthenticationForm = AuthenticationType.signup;
    store.authenticationGateway.signup = mockResolve(user);
  });

  it('signs up', async () => {
    await store.dispatch(signup(email, password, nick));

    expect(store.authenticationGateway.signup).toHaveBeenCalledWith(email, password, nick);
    expect(store.user).toEqual(user);
  });

  it('sets the authenticating flag', async () => {
    const promise = store.dispatch(signup(email, password, nick));

    expect(store.select(selectIsAuthenticating)).toBe(true);

    await promise;

    expect(store.select(selectIsAuthenticating)).toBe(false);
  });

  it('closes the authentication modal', async () => {
    await store.dispatch(signup(email, password, nick));

    expect(store.routerGateway.currentAuthenticationForm).toBeUndefined();
  });

  it('shows a snackbar', async () => {
    await store.dispatch(signup(email, password, nick));

    expect(store.snackbarGateway.success).toHaveBeenCalledWith(
      `Votre compte a bien été créé ! Un email de validation a été envoyé à l'adresse ${email}.`,
    );
  });

  it('handles validation errors', async () => {
    store.authenticationGateway.signup = mockReject(
      new ValidationError([{ field: 'nick', error: 'already-exists', value: 'nick' }]),
    );

    await store.dispatch(signup(email, password, nick));

    expect(store.select(selectAuthenticationFieldError, AuthenticationField.nick)).toEqual('already-exists');
  });

  it('shows a snack when the user is already authenticated', async () => {
    store.authenticationGateway.signup = mockReject(
      new AuthorizationError(AuthorizationErrorReason.authenticated),
    );

    await store.dispatch(signup(email, password, nick));

    expect(store.snackbarGateway.warning).toHaveBeenCalledWith('Vous êtes déjà connecté(e)');
  });

  it('clears existing validation errors', async () => {
    store.dispatch(setAuthenticationFieldError(AuthenticationField.password, 'invalid'));

    await store.dispatch(signup(email, password, nick));

    expect(store.select(selectAuthenticationFieldError, AuthenticationField.password)).toBeUndefined();
  });

  it('throws when the gateway throws', async () => {
    const error = new Error();

    store.authenticationGateway.signup = mockReject(error);

    await expect.rejects(store.dispatch(signup(email, password, nick))).with(error);
  });
});
