import { User } from '../types';

export interface AuthenticationGateway {
  fetchUser(): Promise<User | undefined>;
  login(email: string, password: string): Promise<User>;
  signup(email: string, password: string, nick: string): Promise<User>;
  logout(): Promise<void>;
}
