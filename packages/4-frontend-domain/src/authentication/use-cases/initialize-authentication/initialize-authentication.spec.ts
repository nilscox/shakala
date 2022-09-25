import { TestStore } from '../../../test';
import { createAuthUser } from '../../../test/factories';
import { selectUser } from '../../../user/user.selectors';
import {
  setAuthenticationFieldError,
  setAuthenticationFormError,
} from '../../actions/authentication.actions';
import { AuthenticationField, AuthenticationType } from '../../authentication.types';
import {
  selectAuthenticationFieldError,
  selectAuthenticationForm,
  selectAuthenticationFormError,
  selectAuthenticationFormUnsafe,
  selectIsAuthenticationModalOpen,
} from '../../selectors/authentication.selectors';

import { initializeAuthentication } from './initialize-authentication';

describe('initializeAuthentication', () => {
  const store = new TestStore();

  beforeEach(() => {
    store.routerGateway.setQueryParam('auth', 'login');
  });

  it('stores the current authentication form', async () => {
    await store.dispatch(initializeAuthentication());

    expect(store.select(selectAuthenticationForm)).toEqual(AuthenticationType.login);
  });

  it('opens the modal when current location has a query param "auth"', async () => {
    await store.dispatch(initializeAuthentication());

    expect(store.select(selectIsAuthenticationModalOpen)).toBe(true);
  });

  it('updates the current authentication form when the location changes', async () => {
    await store.dispatch(initializeAuthentication());

    store.routerGateway.setQueryParam('auth', 'signup');

    expect(store.select(selectAuthenticationForm)).toEqual(AuthenticationType.signup);

    store.routerGateway.removeQueryParam('auth');

    expect(store.select(selectAuthenticationFormUnsafe)).toBeUndefined();
  });

  it('clears all errors when the location changes', async () => {
    await store.dispatch(initializeAuthentication());

    store.dispatch(setAuthenticationFieldError(AuthenticationField.email, 'invalid'));
    store.dispatch(setAuthenticationFormError('error'));

    store.routerGateway.setQueryParam('auth', 'signup');

    expect(store.select(selectAuthenticationFieldError, AuthenticationField.email)).toBeUndefined();
    expect(store.select(selectAuthenticationFormError)).toBeUndefined();
  });

  it('fetches the authenticated user', async () => {
    const user = createAuthUser();

    store.authenticationGateway.fetchUser.mockResolvedValue(user);

    await store.dispatch(initializeAuthentication());

    expect(store.select(selectUser)).toEqual(user);
  });

  it('removes the query param when its value is not valid', async () => {
    store.routerGateway.setQueryParam('auth', 'register');

    await store.dispatch(initializeAuthentication());

    expect(store.routerGateway.getQueryParam('auth')).toBeUndefined();
    expect(store.loggerGateway.warn).toHaveBeenCalledWith('invalid authentication form type "register"');
    expect(store.select(selectIsAuthenticationModalOpen)).toBe(false);
  });
});
