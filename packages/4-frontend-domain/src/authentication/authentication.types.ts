import { isEnumValue } from 'shared';

// todo: transform to enum
export enum AuthenticationField {
  email = 'email',
  password = 'password',
  nick = 'nick',
  acceptRulesCheckbox = 'acceptRulesCheckbox',
}

export const isAuthenticationField = isEnumValue(AuthenticationField);

export enum AuthenticationForm {
  login = 'login',
  signup = 'signup',
  emailLogin = 'email-login',
}

export const isAuthenticationForm = isEnumValue(AuthenticationForm);