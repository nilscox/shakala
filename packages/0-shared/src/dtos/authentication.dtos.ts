import { BaseError, createFactory, randomId } from '../libs';

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

export class NickTooShortError extends BaseError<{ nick: string; minLength: number }> {
  status = 400;

  constructor(nick: string, minLength: number) {
    super('nick is too short', { nick, minLength });
  }
}

export class EmailAlreadyExistsError extends BaseError<{ email: string }> {
  status = 400;

  constructor(email: string) {
    super('email already exists', { email });
  }
}

export class NickAlreadyExistsError extends BaseError<{ nick: string }> {
  status = 400;

  constructor(nick: string) {
    super('nick already exists', { nick });
  }
}

export class InvalidCredentials extends BaseError {
  status = 401;

  constructor() {
    super('invalid email / password combinaison');
  }
}

export enum EmailValidationFailedReason {
  alreadyValidated = 'alreadyValidated',
  invalidToken = 'invalidToken',
}

export class EmailValidationFailed extends BaseError<{ reason: EmailValidationFailedReason }> {
  status = 400;

  constructor(reason: EmailValidationFailedReason) {
    super('email validation failed', { reason });
  }
}
