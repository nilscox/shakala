import { mockResolve } from 'shared';

import { TestStore } from '../../../test';
import { createAuthUser } from '../../../test/factories';
import { setAuthenticationFieldError, setAuthenticationFormError } from '../../authentication.actions';
import {
  selectAuthenticationFieldError,
  selectAuthenticationFormError,
} from '../../authentication.selectors';
import { AuthenticationField, AuthenticationType } from '../../authentication.types';

import { initializeAuthentication } from './initialize-authentication';

describe('initializeAuthentication', () => {
  const store = new TestStore();

  beforeEach(() => {
    store.routerGateway.currentAuthenticationForm = AuthenticationType.login;
  });

  it('clears all errors when the location changes', async () => {
    await store.dispatch(initializeAuthentication());

    store.dispatch(setAuthenticationFieldError(AuthenticationField.email, 'invalid'));
    store.dispatch(setAuthenticationFormError('error'));

    store.routerGateway.currentAuthenticationForm = AuthenticationType.signup;
    store.routerGateway.triggerLocationChange();

    expect(store.select(selectAuthenticationFieldError, AuthenticationField.email)).toBe(undefined);
    expect(store.select(selectAuthenticationFormError)).toBe(undefined);
  });

  it('fetches the authenticated user', async () => {
    const user = createAuthUser();

    store.authenticationGateway.fetchUser = mockResolve(user);

    await store.dispatch(initializeAuthentication());

    expect(store.user).toEqual(user);
  });
});
