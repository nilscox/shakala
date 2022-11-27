import { Selectors } from '@nilscox/redux-kooltik';
import { createSelector } from 'reselect';
import { isEnumValue } from 'shared';

import { AppState } from '../../store';
import { routerSelectors } from '../router';

import { AuthenticationState } from './authentication.actions';
import { AuthenticationField, AuthenticationFormType } from './authentication.types';

class AuthenticationSelectors extends Selectors<AppState, AuthenticationState> {
  constructor() {
    super((state) => state.authentication);
  }

  isSubmitting = this.propertySelector('submitting');

  currentForm = createSelector([(state) => routerSelectors.queryParam(state, 'auth')], (auth) => {
    if (isEnumValue(AuthenticationFormType)(auth)) {
      return auth;
    }
  });

  isModalOpen = createSelector(this.currentForm, (form) => form !== undefined);

  // not a selector because the from is the debounced value when the dialog is closing
  isAuthenticationFieldVisible = (form: AuthenticationFormType, field: AuthenticationField) => {
    if (field === 'email') {
      return true;
    }

    if (field === 'password') {
      return form !== AuthenticationFormType.emailLogin;
    }

    return form === AuthenticationFormType.signup;
  };
}

export const authenticationSelectors = new AuthenticationSelectors();
