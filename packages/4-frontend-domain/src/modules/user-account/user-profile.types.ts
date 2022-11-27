import { createFactory, randomId } from 'shared';

export type AuthenticatedUser = {
  id: string;
  nick: string;
  email: string;
  profileImage?: string;
  signupDate: string;
};

export type AuthUser = AuthenticatedUser;

export const createAuthUser = createFactory<AuthenticatedUser>(() => ({
  id: randomId(),
  nick: '',
  email: '',
  signupDate: '',
}));
