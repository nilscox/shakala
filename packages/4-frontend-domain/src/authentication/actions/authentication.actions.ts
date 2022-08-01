import { AuthUser } from '../../types';
import { authenticationSlice } from '../authentication.slice';
import { AuthenticationField, AuthenticationForm } from '../authentication.types';
import { setUser as setUserAction } from '../user.slice';

const actions = authenticationSlice.actions;

export const setUser = (user: AuthUser) => {
  return setUserAction({ user });
};

export const setIsAuthenticationModalOpen = (open: boolean) => {
  return actions.setIsModalOpen({ open });
};

export const setAuthenticationForm = (form?: AuthenticationForm) => {
  return actions.setAuthenticationForm({ form });
};

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
