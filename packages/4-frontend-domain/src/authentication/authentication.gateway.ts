import { BaseError } from 'shared';

import { AuthUser } from '../types';

export interface AuthenticationGateway {
  fetchUser(): Promise<AuthUser | undefined>;
  login(email: string, password: string): Promise<AuthUser>;
  signup(email: string, password: string, nick: string): Promise<AuthUser>;
  logout(): Promise<void>;
}

export const InvalidCredentialsError = BaseError.extend('invalid credentials');
