import { Actions } from '@nilscox/redux-kooltik';

import { handleAuthenticate } from './handle-authenticate/handle-authenticate';
import { logout } from './logout/logout';
import {
  closeAuthenticationForm,
  requireAuthentication,
  setAuthenticationForm,
} from './require-authentication/require-authentication';

class AuthenticationActions extends Actions<unknown> {
  constructor() {
    super('authentication', {});
  }

  authenticate = handleAuthenticate;
  setAuthenticationForm = setAuthenticationForm;
  closeAuthenticationForm = closeAuthenticationForm;
  logout = logout;
  requireAuthentication = requireAuthentication;
}

export const authenticationActions = new AuthenticationActions();
