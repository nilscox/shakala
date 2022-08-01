import { TestStore } from '../../../test';
import {
  setAuthenticationFieldError,
  setAuthenticationFormError,
} from '../../actions/authentication.actions';
import { AuthenticationField } from '../../authentication.types';
import {
  selectAuthenticationFieldError,
  selectAuthenticationFormError,
  selectIsAuthenticationFormValid,
} from '../../selectors/authentication.selectors';

import { handleAuthenticationFormChange } from './handle-authentication-form-change';

describe('handleAuthenticationFormChange', () => {
  const store = new TestStore();

  it('updates the isValid flag', () => {
    store.dispatch(handleAuthenticationFormChange(true, 'email'));

    expect(store.select(selectIsAuthenticationFormValid)).toBe(true);

    store.dispatch(handleAuthenticationFormChange(false, 'email'));

    expect(store.select(selectIsAuthenticationFormValid)).toBe(false);
  });

  it('clears the error on the changed field', () => {
    store.dispatch(setAuthenticationFieldError(AuthenticationField.email, 'invalid'));

    store.dispatch(handleAuthenticationFormChange(true, 'email'));

    expect(store.select(selectAuthenticationFieldError, AuthenticationField.email)).toBeUndefined();
  });

  it('clears the form error', () => {
    store.dispatch(setAuthenticationFormError('error'));

    store.dispatch(handleAuthenticationFormChange(true, 'email'));

    expect(store.select(selectAuthenticationFormError)).toBeUndefined();
  });
});
