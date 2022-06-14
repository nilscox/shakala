import { AuthUserDto } from './dtos';

export const createAuthUserDto = (overrides: Partial<AuthUserDto> = {}): AuthUserDto => ({
  id: '',
  nick: '',
  email: '',
  signupDate: '',
  profileImage: undefined,
  ...overrides,
});
