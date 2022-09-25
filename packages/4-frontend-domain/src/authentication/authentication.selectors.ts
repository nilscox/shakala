import { State } from '../store.types';

import { AuthenticationField, AuthenticationType } from './authentication.types';

const selectAuthenticationSlice = (state: State) => {
  return state.authentication;
};

export const selectIsAuthenticating = (state: State) => {
  return selectAuthenticationSlice(state).authenticating;
};

export const isAuthenticationFieldVisible = (form: AuthenticationType, field: AuthenticationField) => {
  if (field === 'email') {
    return true;
  }

  if (field === 'password') {
    return form !== AuthenticationType.emailLogin;
  }

  return form === AuthenticationType.signup;
};

export const selectAreRulesAccepted = (state: State) => {
  return selectAuthenticationSlice(state).rulesAccepted;
};

export const selectIsAcceptRulesWarningVisible = (state: State) => {
  return selectAuthenticationSlice(state).acceptRulesWarningVisible;
};

export const selectAuthenticationFieldError = (state: State, field: AuthenticationField) => {
  return selectAuthenticationSlice(state).fieldErrors[field];
};

export const selectAuthenticationFormError = (state: State) => {
  return selectAuthenticationSlice(state).formError;
};

export const selectIsAuthenticationFormValid = (state: State) => {
  return selectAuthenticationSlice(state).isValid;
};

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
