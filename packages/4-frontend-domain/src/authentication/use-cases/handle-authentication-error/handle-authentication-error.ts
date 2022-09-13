import { get } from 'shared';

import { Thunk } from '../../../store';
import { AuthorizationError, AuthorizationErrorReason, ValidationError } from '../../../types';
import {
  setAuthenticationFieldError,
  setAuthenticationFormError,
} from '../../actions/authentication.actions';
import { AuthenticationField } from '../../authentication.types';

export const handleAuthenticationError = (error: unknown): Thunk<void> => {
  return (dispatch, _getState, { snackbarGateway }) => {
    const message = get(error, 'message');

    if (error instanceof ValidationError) {
      for (const { field, error: message } of error.fields) {
        dispatch(setAuthenticationFieldError(field as AuthenticationField, message));
      }
    } else if (message === 'InvalidCredentials') {
      dispatch(setAuthenticationFormError(message));
    } else if (
      error instanceof AuthorizationError &&
      error.reason === AuthorizationErrorReason.authenticated
    ) {
      snackbarGateway.warning('Vous êtes déjà connecté(e)');
    } else {
      snackbarGateway.error("Une erreur s'est produite");
      throw error;
    }
  };
};
