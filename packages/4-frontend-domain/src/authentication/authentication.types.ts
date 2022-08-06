import { isEnumValue } from 'shared';

export enum AuthenticationField {
  email = 'email',
  password = 'password',
  nick = 'nick',
  acceptRulesCheckbox = 'acceptRulesCheckbox',
}

export type EmailLoginForm = {
  email: string;
};

export type LoginForm = {
  email: string;
  password: string;
};

export type SignupForm = {
  email: string;
  password: string;
  nick: string;
  acceptRulesCheckbox: boolean;
};

export type AuthenticationForm = EmailLoginForm | LoginForm | SignupForm;

export const isAuthenticationField = isEnumValue(AuthenticationField);

export enum AuthenticationType {
  login = 'login',
  signup = 'signup',
  emailLogin = 'email-login',
}

export const isAuthenticationForm = isEnumValue(AuthenticationType);
