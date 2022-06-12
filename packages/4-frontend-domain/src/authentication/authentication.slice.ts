import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { State } from '../store';

export type AuthenticationField = 'email' | 'password' | 'nick';

type AuthenticationSlice = {
  authenticating: boolean;
  fieldErrors: Partial<Record<AuthenticationField, string>>;
  formError?: string;
};

const initialState: AuthenticationSlice = {
  authenticating: false,
  fieldErrors: {},
};

export const authenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    setAuthenticating(state, { payload }: PayloadAction<{ authenticating: boolean }>) {
      state.authenticating = payload.authenticating;
    },
    setAuthenticationFieldError(
      state,
      { payload }: PayloadAction<{ field: AuthenticationField; error: string }>,
    ) {
      state.fieldErrors[payload.field] = payload.error;
    },
    setAuthenticationFormError(state, { payload }: PayloadAction<{ error: string }>) {
      state.formError = payload.error;
    },
    clearAuthenticationFieldError(state, { payload }: PayloadAction<{ field: AuthenticationField }>) {
      delete state.fieldErrors[payload.field];
    },
    clearAllAuthenticationFieldErrors(state) {
      state.fieldErrors = {};
    },
  },
});

export const {
  setAuthenticating,
  setAuthenticationFieldError,
  setAuthenticationFormError,
  clearAuthenticationFieldError,
  clearAllAuthenticationFieldErrors,
} = authenticationSlice.actions;

const selectAuthenticationSlice = (state: State) => state.authentication;

export const selectIsAuthenticating = createSelector(
  selectAuthenticationSlice,
  (slice) => slice.authenticating,
);

export const selectAuthenticationFieldError = createSelector(
  [selectAuthenticationSlice, (_, field: AuthenticationField) => field],
  (slice, field) => slice.fieldErrors[field],
);

export const selectAuthenticationFormError = createSelector(
  selectAuthenticationSlice,
  (slice) => slice.formError,
);
