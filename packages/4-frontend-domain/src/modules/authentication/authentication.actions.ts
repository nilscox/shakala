import { Actions } from '@nilscox/redux-kooltik';

import { handleAuthenticate } from './handle-authenticate/handle-authenticate';
import { logout } from './logout/logout';
import {
  closeAuthenticationForm,
  requireAuthentication,
} from './require-authentication/require-authentication';

export type AuthenticationState = {
  // todo: use isSubmitting flag
  submitting: boolean;
};

class AuthenticationActions extends Actions<AuthenticationState> {
  constructor() {
    super('authentication', {
      submitting: false,
    });
  }

  setSubmitting = this.createSetter('submitting');

  authenticate = handleAuthenticate;
  closeAuthenticationForm = closeAuthenticationForm;
  logout = logout;
  requireAuthentication = requireAuthentication;
}

export const authenticationActions = new AuthenticationActions();
