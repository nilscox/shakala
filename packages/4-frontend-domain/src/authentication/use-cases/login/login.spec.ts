import { AuthorizationErrorReason } from 'shared';

import { TestStore } from '../../../test';
import { createAuthUser } from '../../../test/factories';
import { AuthorizationError, ValidationError } from '../../../types';
import {
  setAuthenticationFieldError,
  setIsAuthenticationModalOpen,
} from '../../actions/authentication.actions';
import { InvalidCredentialsError } from '../../authentication.gateway';
import { AuthenticationField } from '../../authentication.types';
import {
  selectAuthenticationFieldError,
  selectAuthenticationFormError,
  selectIsAuthenticating,
  selectIsAuthenticationModalOpen,
} from '../../selectors/authentication.selectors';
import { selectUser } from '../../selectors/user.selectors';

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
    store.dispatch(setIsAuthenticationModalOpen(true));
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

  it('closes the authentication modal', async () => {
    await store.dispatch(login(email, password));

    expect(store.select(selectIsAuthenticationModalOpen)).toBe(false);
  });

  it('shows a snackbar', async () => {
    await store.dispatch(login(email, password));

    expect(store.snackbarGateway.success).toHaveBeenCalledWith('Vous êtes maintenant connecté(e)');
  });

  it('handles validation errors', async () => {
    store.authenticationGateway.login.mockRejectedValue(
      new ValidationError([{ field: 'email', error: 'required', value: null }]),
    );

    await store.dispatch(login(email, password));

    expect(store.select(selectAuthenticationFieldError, AuthenticationField.email)).toEqual('required');
  });

  it('handles invalid credentials error', async () => {
    store.authenticationGateway.login.mockRejectedValue(new InvalidCredentialsError());

    await store.dispatch(login(email, password));

    expect(store.select(selectAuthenticationFormError)).toEqual('InvalidCredentials');
  });

  it('shows a snack when the user is already authenticated', async () => {
    store.authenticationGateway.login.mockRejectedValue(
      new AuthorizationError(AuthorizationErrorReason.authenticated),
    );

    await store.dispatch(login(email, password));

    expect(store.snackbarGateway.warning).toHaveBeenCalledWith('Vous êtes déjà connecté(e)');
  });

  it('clears existing validation errors', async () => {
    store.dispatch(setAuthenticationFieldError(AuthenticationField.password, 'invalid'));

    await store.dispatch(login(email, password));

    expect(store.select(selectAuthenticationFieldError, AuthenticationField.password)).toBeUndefined();
  });

  it('throws when the gateway throws', async () => {
    const error = new Error();

    store.authenticationGateway.login.mockRejectedValue(error);

    await expect(store.dispatch(login(email, password))).rejects.toThrow(error);
    expect(store.snackbarGateway.error).toHaveBeenCalledWith("Une erreur s'est produite");
  });
});
