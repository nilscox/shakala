import { TestStore } from '../../test';
import {
  setAuthenticationFieldError,
  setAuthenticationForm,
  setAuthenticationFormError,
  setIsAuthenticationFormValid,
  setRulesAccepted,
} from '../actions/authentication.actions';
import { AuthenticationField, AuthenticationType } from '../authentication.types';

import {
  selectIsAuthenticationFieldVisible,
  selectCanSubmitAuthenticationForm,
} from './authentication.selectors';

describe('authentication selectors', () => {
  const store = new TestStore();

  describe('selectIsAuthenticationFieldVisible', () => {
    const expectFieldVisible = (field: AuthenticationField) => {
      return expect(store.select(selectIsAuthenticationFieldVisible, field));
    };

    test('email-login form', () => {
      store.dispatch(setAuthenticationForm(AuthenticationType.emailLogin));

      expectFieldVisible(AuthenticationField.email).toBe(true);
      expectFieldVisible(AuthenticationField.password).toBe(false);
      expectFieldVisible(AuthenticationField.nick).toBe(false);
      expectFieldVisible(AuthenticationField.acceptRulesCheckbox).toBe(false);
    });

    test('login form', () => {
      store.dispatch(setAuthenticationForm(AuthenticationType.login));

      expectFieldVisible(AuthenticationField.email).toBe(true);
      expectFieldVisible(AuthenticationField.password).toBe(true);
      expectFieldVisible(AuthenticationField.nick).toBe(false);
      expectFieldVisible(AuthenticationField.acceptRulesCheckbox).toBe(false);
    });

    test('signup form', () => {
      store.dispatch(setAuthenticationForm(AuthenticationType.signup));

      expectFieldVisible(AuthenticationField.email).toBe(true);
      expectFieldVisible(AuthenticationField.password).toBe(true);
      expectFieldVisible(AuthenticationField.nick).toBe(true);
      expectFieldVisible(AuthenticationField.acceptRulesCheckbox).toBe(true);
    });
  });

  describe('selectIsAuthenticationFormDisabled', () => {
    beforeEach(() => {
      store.dispatch(setIsAuthenticationFormValid(true));
      store.dispatch(setRulesAccepted(true));
    });

    test('valid form', () => {
      expect(store.select(selectCanSubmitAuthenticationForm)).toEqual(true);
    });

    test('invalid form', () => {
      store.dispatch(setIsAuthenticationFormValid(false));

      expect(store.select(selectCanSubmitAuthenticationForm)).toEqual(false);
    });

    test('fields errors', () => {
      store.dispatch(setAuthenticationFieldError(AuthenticationField.email, 'error'));

      expect(store.select(selectCanSubmitAuthenticationForm)).toEqual(false);
    });

    test('form error', () => {
      store.dispatch(setAuthenticationFormError('error'));

      expect(store.select(selectCanSubmitAuthenticationForm)).toEqual(false);
    });

    test('rules not accepted', () => {
      store.dispatch(setRulesAccepted(false));

      store.dispatch(setAuthenticationForm(AuthenticationType.emailLogin));
      expect(store.select(selectCanSubmitAuthenticationForm)).toEqual(true);

      store.dispatch(setAuthenticationForm(AuthenticationType.login));
      expect(store.select(selectCanSubmitAuthenticationForm)).toEqual(true);

      store.dispatch(setAuthenticationForm(AuthenticationType.signup));
      expect(store.select(selectCanSubmitAuthenticationForm)).toEqual(false);
    });
  });
});
