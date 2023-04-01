import { SignInBody, SignUpBody, UserDto } from '@shakala/shared';
import { injected } from 'brandi';

import { HttpError } from '~/adapters/http/http-error';
import { TOKENS } from '~/app/tokens';

import { HttpPort } from '../../http/http.port';

import { AuthenticationPort } from './authentication.port';

export class ApiAuthenticationAdapter implements AuthenticationPort {
  constructor(protected readonly http: HttpPort) {}

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
    const onError = (error: HttpError) => {
      if (error.code === 'UnauthorizedError') {
        throw new Error('AlreadyAuthenticated');
      }

      throw error;
    };

    await this.http.post<SignUpBody>('/auth/sign-up', { nick, email, password }, { onError });
  }

  async signIn(email: string, password: string): Promise<void> {
    const onError = (error: HttpError) => {
      if (error.code === 'InvalidCredentialsError') {
        throw new Error('InvalidCredentials');
      }

      if (error.code === 'UnauthorizedError') {
        throw new Error('AlreadyAuthenticated');
      }

      throw error;
    };

    await this.http.post<SignInBody>('/auth/sign-in', { email, password }, { onError });
  }

  async signOut(): Promise<void> {
    await this.http.post('/auth/sign-out');
  }
}

injected(ApiAuthenticationAdapter, TOKENS.http);
