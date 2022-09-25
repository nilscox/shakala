import { createSelector } from '@reduxjs/toolkit';

import { State } from '../store';

import { AuthenticationField, AuthenticationType } from './authentication.types';

const selectAuthenticationSlice = (state: State) => state.authentication;

export const selectIsAuthenticating = createSelector(
  selectAuthenticationSlice,
  (slice) => slice.authenticating,
);

export const isAuthenticationFieldVisible = (form: AuthenticationType, field: AuthenticationField) => {
  if (field === 'email') {
    return true;
  }

  if (field === 'password') {
    return form !== AuthenticationType.emailLogin;
  }

  return form === AuthenticationType.signup;
};

export const selectAreRulesAccepted = createSelector(
  selectAuthenticationSlice,
  (slice) => slice.rulesAccepted,
);

export const selectIsAcceptRulesWarningVisible = createSelector(
  selectAuthenticationSlice,
  (slice) => slice.acceptRulesWarningVisible,
);

export const selectAuthenticationFieldError = createSelector(
  [selectAuthenticationSlice, (_, field: AuthenticationField) => field],
  (slice, field) => slice.fieldErrors[field],
);

export const selectAuthenticationFormError = createSelector(
  selectAuthenticationSlice,
  (slice) => slice.formError,
);

export const selectIsAuthenticationFormValid = createSelector(
  selectAuthenticationSlice,
  (slice) => slice.isValid,
);

export const selectCanSubmitAuthenticationForm = (state: State, form: AuthenticationType) => {
  const { isValid, fieldErrors, formError, rulesAccepted } = selectAuthenticationSlice(state);

  if (!isValid) {
    return false;
  }

  if (Object.values(fieldErrors).length > 0) {
    return false;
  }

  if (formError !== undefined) {
    return false;
  }

  if (form === AuthenticationType.signup && !rulesAccepted) {
    return false;
  }

  return true;
};
