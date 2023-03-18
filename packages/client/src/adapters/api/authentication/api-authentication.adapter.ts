import { SignInBody, SignUpBody, UserDto } from '@shakala/shared';

import { ApiAdapter } from '../api-adapter';

import { AuthenticationPort } from './authentication.port';

export class ApiAuthenticationAdapter extends ApiAdapter implements AuthenticationPort {
  async getAuthenticatedUser(): Promise<UserDto | undefined> {
    const response = await this.http.get<UserDto | undefined>('/account', {
      onError(error) {
        if (error.response.status === 401) {
          return undefined;
        }

        throw error;
      },
    });

    return response.body;
  }

  async signUp(nick: string, email: string, password: string): Promise<void> {
    await this.http.post<SignUpBody>('/auth/sign-up', {
      nick,
      email,
      password,
    });
  }

  async signIn(email: string, password: string): Promise<void> {
    await this.http.post<SignInBody>('/auth/sign-in', {
      email,
      password,
    });
  }
}
