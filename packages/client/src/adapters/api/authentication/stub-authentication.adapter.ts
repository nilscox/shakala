import { stub } from '@shakala/shared';

import { AuthenticationPort } from './authentication.port';

export class StubAuthenticationAdapter implements AuthenticationPort {
  getAuthenticatedUser = stub<AuthenticationPort['getAuthenticatedUser']>();
  signUp = stub<AuthenticationPort['signUp']>();
  signIn = stub<AuthenticationPort['signIn']>();
}
