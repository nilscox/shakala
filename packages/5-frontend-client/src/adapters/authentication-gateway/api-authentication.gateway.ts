import { AuthenticatedUser, AuthenticationGateway, InvalidCredentialsError } from 'frontend-domain';
import { AuthUserDto, LoginBodyDto, SignupBodyDto } from 'shared';

import { ApiHttpError } from '../http-gateway/api-fetch-http.gateway';
import { HttpGateway } from '../http-gateway/http.gateway';

export class ApiAuthenticationGateway implements AuthenticationGateway {
  constructor(private readonly http: HttpGateway) {}

  async fetchAuthenticatedUser(): Promise<AuthenticatedUser | undefined> {
    const { body } = await this.http.read<AuthUserDto | undefined>('get', '/auth/me');
    return body;
  }

  async login(email: string, password: string): Promise<AuthenticatedUser> {
    const { body } = await this.http.write<AuthUserDto, LoginBodyDto>('post', '/auth/login', {
      body: { email, password },
      onError(error) {
        if (ApiHttpError.is(error, 'InvalidCredentials')) {
          throw new InvalidCredentialsError();
        }

        throw error;
      },
    });

    return body;
  }

  async signup(email: string, password: string, nick: string): Promise<string> {
    const { body } = await this.http.write<AuthUserDto, SignupBodyDto>('post', '/auth/signup', {
      body: { email, password, nick },
    });

    return body.id;
  }

  async logout(): Promise<void> {
    await this.http.write('post', '/auth/logout');
  }
}
