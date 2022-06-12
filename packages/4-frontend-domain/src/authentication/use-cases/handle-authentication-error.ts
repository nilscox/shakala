import { get } from 'shared';

import type { Thunk } from '../../store';
import { ValidationError } from '../../types';
import {
  AuthenticationField,
  setAuthenticationFieldError,
  setAuthenticationFormError,
} from '../authentication.slice';

export const handleAuthenticationError = (error: unknown): Thunk<void> => {
  return (dispatch) => {
    const message = get(error, 'message');

    if (error instanceof ValidationError) {
      for (const { field, error: message } of error.fields) {
        dispatch(setAuthenticationFieldError({ field: field as AuthenticationField, error: message }));
      }
    } else if (message === 'InvalidCredentials') {
      dispatch(setAuthenticationFormError({ error: message }));
    } else {
      throw error;
    }
  };
};
