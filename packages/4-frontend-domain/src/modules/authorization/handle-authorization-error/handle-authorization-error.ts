import { AuthorizationError, AuthorizationErrorReason } from '@shakala/shared';

import { AppThunk } from '../../../store';

export const handleAuthorizationError = (
  error: unknown,
  action = 'effectuer cette action',
): AppThunk<boolean> => {
  return (_dispatch, _getState, { snackbarGateway }) => {
    if (!(error instanceof AuthorizationError)) {
      return false;
    }

    const prefix = messages[error.details.reason as keyof typeof messages] ?? fallback;
    snackbarGateway.error(`${prefix} ${action}.`);

    return true;
  };
};

const fallback = "Vous n'avez pas les autorisations nécessaires pour";

const messages: Record<AuthorizationErrorReason, string> = {
  unauthenticated: 'Vous devez être connecté.e avant de pouvoir',
  authenticated: 'Vous ne devez pas être connecté.e pour pouvoir',
  emailValidationRequired: 'Vous devez valider votre adresse email avant de pouvoir',
  isReadOnly: fallback,
};
