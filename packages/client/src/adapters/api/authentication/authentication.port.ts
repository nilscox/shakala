import { UserDto } from '@shakala/shared';

export interface AuthenticationPort {
  getAuthenticatedUser(): Promise<UserDto | undefined>;
}
