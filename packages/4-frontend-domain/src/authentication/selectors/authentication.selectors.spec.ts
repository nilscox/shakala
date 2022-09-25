import { TestStore } from '../../test';
import {
  setAuthenticationFieldError,
  setAuthenticationFormError,
  setIsAuthenticationFormValid,
  setRulesAccepted,
} from '../actions/authentication.actions';
import { AuthenticationField, AuthenticationType } from '../authentication.types';

import { isAuthenticationFieldVisible, selectCanSubmitAuthenticationForm } from './authentication.selectors';

describe('authentication selectors', () => {
  const store = new TestStore();

  describe('isAuthenticationFieldVisible', () => {
    test('email-login form', () => {
      const form = AuthenticationType.emailLogin;

      expect(isAuthenticationFieldVisible(form, AuthenticationField.email)).toBe(true);
      expect(isAuthenticationFieldVisible(form, AuthenticationField.password)).toBe(false);
      expect(isAuthenticationFieldVisible(form, AuthenticationField.nick)).toBe(false);
      expect(isAuthenticationFieldVisible(form, AuthenticationField.acceptRulesCheckbox)).toBe(false);
    });

    test('login form', () => {
      const form = AuthenticationType.login;

      expect(isAuthenticationFieldVisible(form, AuthenticationField.email)).toBe(true);
      expect(isAuthenticationFieldVisible(form, AuthenticationField.password)).toBe(true);
      expect(isAuthenticationFieldVisible(form, AuthenticationField.nick)).toBe(false);
      expect(isAuthenticationFieldVisible(form, AuthenticationField.acceptRulesCheckbox)).toBe(false);
    });

    test('signup form', () => {
      const form = AuthenticationType.signup;

      expect(isAuthenticationFieldVisible(form, AuthenticationField.email)).toBe(true);
      expect(isAuthenticationFieldVisible(form, AuthenticationField.password)).toBe(true);
      expect(isAuthenticationFieldVisible(form, AuthenticationField.nick)).toBe(true);
      expect(isAuthenticationFieldVisible(form, AuthenticationField.acceptRulesCheckbox)).toBe(true);
    });
  });

  describe('selectIsAuthenticationFormDisabled', () => {
    beforeEach(() => {
      store.dispatch(setIsAuthenticationFormValid(true));
      store.dispatch(setRulesAccepted(true));
    });

    test('valid form', () => {
      expect(store.select(selectCanSubmitAuthenticationForm, AuthenticationType.signup)).toEqual(true);
    });

    test('invalid form', () => {
      store.dispatch(setIsAuthenticationFormValid(false));

      expect(store.select(selectCanSubmitAuthenticationForm, AuthenticationType.signup)).toEqual(false);
    });

    test('fields errors', () => {
      store.dispatch(setAuthenticationFieldError(AuthenticationField.email, 'error'));

      expect(store.select(selectCanSubmitAuthenticationForm, AuthenticationType.signup)).toEqual(false);
    });

    test('form error', () => {
      store.dispatch(setAuthenticationFormError('error'));

      expect(store.select(selectCanSubmitAuthenticationForm, AuthenticationType.signup)).toEqual(false);
    });

    test('rules not accepted', () => {
      store.dispatch(setRulesAccepted(false));

      expect(store.select(selectCanSubmitAuthenticationForm, AuthenticationType.emailLogin)).toEqual(true);
      expect(store.select(selectCanSubmitAuthenticationForm, AuthenticationType.login)).toEqual(true);
      expect(store.select(selectCanSubmitAuthenticationForm, AuthenticationType.signup)).toEqual(false);
    });
  });
});
