import { UserDto } from '@shakala/shared';

import { ApiAdapter } from '../api-adapter';

export interface AuthenticationPort extends ApiAdapter {
  getAuthenticatedUser(): Promise<UserDto | undefined>;
}
