import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AuthenticationField, AuthenticationType } from './authentication.types';

type AuthenticationSlice = {
  isModalOpen: boolean;
  form?: AuthenticationType;
  rulesAccepted: boolean;
  acceptRulesWarningVisible: boolean;
  isValid: boolean;
  authenticating: boolean;
  fieldErrors: Partial<Record<AuthenticationField, string>>;
  formError?: string;
};

const initialState: AuthenticationSlice = {
  isModalOpen: false,
  rulesAccepted: false,
  acceptRulesWarningVisible: false,
  isValid: false,
  authenticating: false,
  fieldErrors: {},
};

export const authenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    setIsModalOpen(state, { payload }: PayloadAction<{ open: boolean }>) {
      state.isModalOpen = payload.open;
    },
    setAuthenticationForm(state, { payload }: PayloadAction<{ form?: AuthenticationType }>) {
      state.form = payload.form;
    },
    setAcceptRulesWarningVisible(state, { payload }: PayloadAction<{ visible: boolean }>) {
      state.acceptRulesWarningVisible = payload.visible;
    },
    setRulesAccepted(state, { payload }: PayloadAction<{ accepted: boolean }>) {
      state.rulesAccepted = payload.accepted;
    },
    setIsAuthenticationFormValid(state, { payload }: PayloadAction<{ valid: boolean }>) {
      state.isValid = payload.valid;
    },
    setAuthenticating(state, { payload }: PayloadAction<{ authenticating: boolean }>) {
      state.authenticating = payload.authenticating;
    },
    setAuthenticationFieldError(
      state,
      { payload }: PayloadAction<{ field: AuthenticationField; error: string }>,
    ) {
      state.fieldErrors[payload.field] = payload.error;
    },
    clearAuthenticationFieldError(state, { payload }: PayloadAction<{ field: AuthenticationField }>) {
      delete state.fieldErrors[payload.field];
    },
    setAuthenticationFormError(state, { payload }: PayloadAction<{ error: string }>) {
      state.formError = payload.error;
    },
    clearAuthenticationFormError(state) {
      delete state.formError;
    },
    clearAllAuthenticationErrors(state) {
      delete state.formError;
      state.fieldErrors = {};
    },
  },
});
