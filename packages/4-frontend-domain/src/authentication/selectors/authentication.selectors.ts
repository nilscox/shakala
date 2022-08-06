import { createSelector } from '@reduxjs/toolkit';

import { State } from '../../store';
import { AuthenticationField, AuthenticationType } from '../authentication.types';

const selectAuthenticationSlice = (state: State) => state.authentication;

export const selectIsAuthenticationModalOpen = createSelector(
  selectAuthenticationSlice,
  (slice) => slice.isModalOpen,
);

export const selectIsAuthenticating = createSelector(
  selectAuthenticationSlice,
  (slice) => slice.authenticating,
);

export const selectAuthenticationFormUnsafe = createSelector(selectAuthenticationSlice, (slice) => {
  return slice.form;
});

export const selectHasAuthenticationForm = createSelector(selectAuthenticationFormUnsafe, (form) => {
  return Boolean(form);
});

export const selectAuthenticationForm = createSelector(selectAuthenticationFormUnsafe, (form) => {
  if (!form) {
    throw new Error(`selectAuthenticationForm: form is not defined`);
  }

  return form;
});

export const selectIsAuthenticationFieldVisible = createSelector(
  [selectAuthenticationForm, (_, field: AuthenticationField) => field],
  (form, field) => {
    if (field === 'email') {
      return true;
    }

    if (field === 'password') {
      return form !== AuthenticationType.emailLogin;
    }

    return form === AuthenticationType.signup;
  },
);

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

export const selectCanSubmitAuthenticationForm = createSelector(selectAuthenticationSlice, (slice) => {
  if (!slice.isValid) {
    return false;
  }

  if (Object.values(slice.fieldErrors).length > 0) {
    return false;
  }

  if (slice.formError !== undefined) {
    return false;
  }

  if (slice.form === AuthenticationType.signup && !slice.rulesAccepted) {
    return false;
  }

  return true;
});
