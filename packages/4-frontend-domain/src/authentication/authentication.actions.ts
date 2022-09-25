import { authenticationSlice } from './authentication.slice';
import { AuthenticationField } from './authentication.types';

const actions = authenticationSlice.actions;

export const setAcceptRulesWarningVisible = (visible: boolean) => {
  return actions.setAcceptRulesWarningVisible({ visible });
};

export const setRulesAccepted = (accepted: boolean) => {
  return actions.setRulesAccepted({ accepted });
};

export const setIsAuthenticationFormValid = (valid: boolean) => {
  return actions.setIsAuthenticationFormValid({ valid });
};

export const setAuthenticating = (authenticating: boolean) => {
  return actions.setAuthenticating({ authenticating });
};

export const setAuthenticationFieldError = (field: AuthenticationField, error: string) => {
  return actions.setAuthenticationFieldError({ field, error });
};

export const clearAuthenticationFieldError = (field: AuthenticationField) => {
  return actions.clearAuthenticationFieldError({ field });
};

export const setAuthenticationFormError = (error: string) => {
  return actions.setAuthenticationFormError({ error });
};

export const clearAuthenticationFormError = () => {
  return actions.clearAuthenticationFormError();
};

export const clearAllAuthenticationErrors = () => {
  return actions.clearAllAuthenticationErrors();
};
