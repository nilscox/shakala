import { UserDto } from '@shakala/shared';

export interface AuthenticationPort {
  getAuthenticatedUser(): Promise<UserDto | undefined>;
  signUp(nick: string, email: string, password: string): Promise<void>;
  signIn(email: string, password: string): Promise<void>;
}
