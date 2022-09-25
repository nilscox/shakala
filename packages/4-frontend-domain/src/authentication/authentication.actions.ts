import { createAction } from '@nilscox/redux-query';

import { AuthenticationField } from './authentication.types';

export const [setAcceptRulesWarningVisible, isSetAcceptRulesWarningVisible] = createAction(
  'authentication/setAcceptRulesWarningVisible',
  (visible: boolean) => ({ visible }),
);

export const [setRulesAccepted, isSetRulesAccepted] = createAction(
  'authentication/setRulesAccepted',
  (accepted: boolean) => ({ accepted }),
);

export const [setIsAuthenticationFormValid, isSetIsAuthenticationFormValid] = createAction(
  'authentication/setIsAuthenticationFormValid',
  (valid: boolean) => ({ valid }),
);

export const [setAuthenticating, isSetAuthenticating] = createAction(
  'authentication/setAuthenticating',
  (authenticating: boolean) => ({ authenticating }),
);

export const [setAuthenticationFieldError, isSetAuthenticationFieldError] = createAction(
  'authentication/setAuthenticationFieldError',
  (field: AuthenticationField, error: string) => ({ field, error }),
);

export const [clearAuthenticationFieldError, isClearAuthenticationFieldError] = createAction(
  'authentication/clearAuthenticationFieldError',
  (field: AuthenticationField) => ({ field }),
);

export const [setAuthenticationFormError, isSetAuthenticationFormError] = createAction(
  'authentication/setAuthenticationFormError',
  (error: string) => ({ error }),
);

export const [clearAuthenticationFormError, isClearAuthenticationFormError] = createAction(
  'authentication/clearAuthenticationFormError',
);

export const [clearAllAuthenticationErrors, isClearAllAuthenticationErrors] = createAction(
  'authentication/clearAllAuthenticationErrors',
);
