import { AuthenticatedUser, AuthenticationGateway, InvalidCredentialsError } from 'frontend-domain';
import { AuthUserDto, LoginBodyDto, SignupBodyDto } from 'shared';

import { ApiHttpError } from '../http-gateway/api-fetch-http.gateway';
import { HttpGateway } from '../http-gateway/http.gateway';

export class ApiAuthenticationGateway implements AuthenticationGateway {
  constructor(private readonly http: HttpGateway) {}

  async fetchAuthenticatedUser(): Promise<AuthenticatedUser | undefined> {
    const { body } = await this.http.get<AuthUserDto | undefined>('/auth/me');
    return body;
  }

  async login(email: string, password: string): Promise<AuthenticatedUser> {
    const { body } = await this.http.post<AuthUserDto, LoginBodyDto>('/auth/login', {
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
    const { body } = await this.http.post<AuthUserDto, SignupBodyDto>('/auth/signup', {
      body: { email, password, nick },
    });

    return body.id;
  }

  async logout(): Promise<void> {
    await this.http.post('/auth/logout');
  }
}
