import { createTestStore, TestStore } from '../../test-store';

import { authenticationSelectors } from './authentication.selectors';
import { AuthenticationField, AuthenticationFormType } from './authentication.types';
import { setCurrentAuthenticationForm } from './require-authentication/require-authentication';

describe('authenticationSelectors', () => {
  let store: TestStore;

  beforeEach(() => {
    store = createTestStore();
  });

  describe('selectCurrentAuthenticationForm', () => {
    const form = () => store.select(authenticationSelectors.currentForm);

    it('email-login form', () => {
      store.dispatch(setCurrentAuthenticationForm(AuthenticationFormType.emailLogin));
      expect(form()).toEqual(AuthenticationFormType.emailLogin);
    });

    it('login form', () => {
      store.dispatch(setCurrentAuthenticationForm(AuthenticationFormType.login));
      expect(form()).toEqual(AuthenticationFormType.login);
    });

    it('signup form', () => {
      store.dispatch(setCurrentAuthenticationForm(AuthenticationFormType.signup));
      expect(form()).toEqual(AuthenticationFormType.signup);
    });

    it('no authentication form', () => {
      expect(form()).toBe(undefined);
    });

    it('not a valid authentication form', () => {
      store.dispatch(setCurrentAuthenticationForm('hello' as AuthenticationFormType));
      expect(form()).toBe(undefined);
    });
  });

  describe('isAuthenticationFieldVisible', () => {
    const isFieldVisible = authenticationSelectors.isAuthenticationFieldVisible;

    it('email-login form', () => {
      const form = AuthenticationFormType.emailLogin;

      expect(isFieldVisible(form, AuthenticationField.email)).toBe(true);
      expect(isFieldVisible(form, AuthenticationField.password)).toBe(false);
      expect(isFieldVisible(form, AuthenticationField.nick)).toBe(false);
      expect(isFieldVisible(form, AuthenticationField.acceptRules)).toBe(false);
    });

    it('login form', () => {
      const form = AuthenticationFormType.login;

      expect(isFieldVisible(form, AuthenticationField.email)).toBe(true);
      expect(isFieldVisible(form, AuthenticationField.password)).toBe(true);
      expect(isFieldVisible(form, AuthenticationField.nick)).toBe(false);
      expect(isFieldVisible(form, AuthenticationField.acceptRules)).toBe(false);
    });

    it('signup form', () => {
      const form = AuthenticationFormType.signup;

      expect(isFieldVisible(form, AuthenticationField.email)).toBe(true);
      expect(isFieldVisible(form, AuthenticationField.password)).toBe(true);
      expect(isFieldVisible(form, AuthenticationField.nick)).toBe(true);
      expect(isFieldVisible(form, AuthenticationField.acceptRules)).toBe(true);
    });
  });
});