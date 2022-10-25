import { createFactory } from '../libs/create-factory';
import { randomId } from '../libs/random-id';

export type AuthUserDto = {
  id: string;
  email: string;
  nick: string;
  profileImage?: string;
  signupDate: string;
};

export const createAuthUserDto = createFactory<AuthUserDto>(() => ({
  id: randomId(),
  nick: '',
  email: '',
  signupDate: '',
  profileImage: undefined,
}));

export enum AuthenticationMethod {
  emailPassword = 'emailPassword',
  token = 'token',
}

export enum AuthorizationErrorReason {
  unauthenticated = 'unauthenticated',
  authenticated = 'authenticated',
  emailValidationRequired = 'emailValidationRequired',
  isReadOnly = 'isReadOnly',
}
