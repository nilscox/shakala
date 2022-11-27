import { AuthenticationGateway } from '../gateways/authentication-gateway';
import { createStubFunction } from '../utils/create-stub-function';

export class StubAuthenticationGateway implements AuthenticationGateway {
  fetchAuthenticatedUser = createStubFunction<AuthenticationGateway['fetchAuthenticatedUser']>();
  signup = createStubFunction<AuthenticationGateway['signup']>();
  login = createStubFunction<AuthenticationGateway['login']>();
  logout = createStubFunction<AuthenticationGateway['logout']>();
}
