import { User } from '../types';

export const createAuthUser = (overrides: Partial<User> = {}): User => ({
  id: '',
  nick: '',
  email: '',
  signupDate: '',
  profileImage: undefined,
  ...overrides,
});
