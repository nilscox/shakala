export enum AuthenticationFormType {
  login = 'login',
  signup = 'signup',
  emailLogin = 'email-login',
}

export type AuthenticationField = 'nick' | 'email' | 'password' | 'acceptRules';

export type AuthenticationForm = {
  email: string;
  password: string;
  nick: string;
  acceptRules: boolean;
};
