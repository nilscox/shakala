import { AuthenticatedUser, AuthUser } from '../modules/user-account';

export interface AuthenticationGateway {
  fetchAuthenticatedUser(): Promise<AuthenticatedUser | undefined>;
  signup(nick: string, email: string, password: string): Promise<string>;
  login(email: string, password: string): Promise<AuthUser>;
  logout(): Promise<void>;
}
