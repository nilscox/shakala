import { AuthenticationGateway, AuthUser, InvalidCredentialsError } from 'frontend-domain';
import { AuthUserDto, LoginBodyDto, SignupBodyDto } from 'shared';

import { HttpGateway } from '../http-gateway/http.gateway';

export class ApiAuthenticationGateway implements AuthenticationGateway {
  constructor(private readonly http: HttpGateway) {}

  async fetchUser(): Promise<AuthUserDto | undefined> {
    const response = await this.http.get<AuthUserDto | undefined>('/auth/me');

    if (response.error) {
      throw response.error;
    }

    return response.body;
  }

  async login(email: string, password: string): Promise<AuthUser> {
    const response = await this.http.post<AuthUserDto, LoginBodyDto>('/auth/login', {
      body: { email, password },
      onError(error) {
        if (error.response.body.code === 'InvalidCredentials') {
          throw new InvalidCredentialsError();
        }

        throw error;
      },
    });

    return response.body;
  }

  async signup(email: string, password: string, nick: string): Promise<AuthUser> {
    const response = await this.http.post<AuthUserDto, SignupBodyDto>('/auth/signup', {
      body: { email, password, nick },
    });

    if (response.error) {
      throw response.error;
    }

    return response.body;
  }

  async logout(): Promise<void> {
    await this.http.post('/auth/logout');
  }
}
