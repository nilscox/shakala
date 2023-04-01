import { isEnumValue } from '@shakala/shared';

export enum AuthForm {
  signIn = 'login',
  signUp = 'register',
  emailLogin = 'email-login',
}

export const isAuthForm = isEnumValue(AuthForm);

export type AuthenticationFields = {
  email: string;
  password: string;
  nick: string;
  acceptRules: boolean;
};
