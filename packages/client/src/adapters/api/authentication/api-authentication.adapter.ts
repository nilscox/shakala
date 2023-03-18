import { UserDto } from '@shakala/shared';

import { HttpPort } from '../../http/http.port';

import { AuthenticationPort } from './authentication.port';

export class ApiAuthenticationAdapter implements AuthenticationPort {
  constructor(private readonly http: HttpPort) {}

  async getAuthenticatedUser(): Promise<UserDto | undefined> {
    const response = await this.http.get<UserDto | undefined>('/api/account', {
      onError(error) {
        if (error.response.status === 404) {
          return undefined;
        }

        throw error;
      },
    });

    return response.body;
  }
}
