import { AnyAction } from 'redux';

import {
  isSetAcceptRulesWarningVisible,
  isSetRulesAccepted,
  isSetIsAuthenticationFormValid,
  isSetAuthenticating,
  isSetAuthenticationFieldError,
  isClearAuthenticationFieldError,
  isSetAuthenticationFormError,
  isClearAuthenticationFormError,
  isClearAllAuthenticationErrors,
} from './authentication.actions';
import { AuthenticationField } from './authentication.types';

type AuthenticationState = {
  isModalOpen: boolean;
  rulesAccepted: boolean;
  acceptRulesWarningVisible: boolean;
  isValid: boolean;
  authenticating: boolean;
  fieldErrors: Partial<Record<AuthenticationField, string>>;
  formError?: string;
};

const initialState: AuthenticationState = {
  isModalOpen: false,
  rulesAccepted: false,
  acceptRulesWarningVisible: false,
  isValid: false,
  authenticating: false,
  fieldErrors: {},
};

export const authenticationReducer = (state = initialState, action: AnyAction): AuthenticationState => {
  if (isSetAcceptRulesWarningVisible(action)) {
    return { ...state, acceptRulesWarningVisible: action.visible };
  }

  if (isSetRulesAccepted(action)) {
    return { ...state, rulesAccepted: action.accepted };
  }

  if (isSetIsAuthenticationFormValid(action)) {
    return { ...state, isValid: action.valid };
  }

  if (isSetAuthenticating(action)) {
    return { ...state, authenticating: action.authenticating };
  }

  if (isSetAuthenticationFieldError(action)) {
    return { ...state, fieldErrors: { ...state.fieldErrors, [action.field]: action.error } };
  }

  if (isClearAuthenticationFieldError(action)) {
    return { ...state, fieldErrors: {} };
  }

  if (isSetAuthenticationFormError(action)) {
    return { ...state, formError: action.error };
  }

  if (isClearAuthenticationFormError(action)) {
    return { ...state, formError: undefined };
  }

  if (isClearAllAuthenticationErrors(action)) {
    return { ...state, fieldErrors: {}, formError: undefined };
  }

  return state;
};
