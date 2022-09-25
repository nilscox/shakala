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
  selectAuthenticationFormError,
} from '../../selectors/authentication.selectors';

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

    expect(store.select(selectAuthenticationFieldError, AuthenticationField.email)).toBeUndefined();
    expect(store.select(selectAuthenticationFormError)).toBeUndefined();
  });

  it('fetches the authenticated user', async () => {
    const user = createAuthUser();

    store.authenticationGateway.fetchUser.mockResolvedValue(user);

    await store.dispatch(initializeAuthentication());

    expect(store.select(selectUser)).toEqual(user);
  });
});
