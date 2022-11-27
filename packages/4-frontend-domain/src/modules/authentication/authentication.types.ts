export enum AuthenticationFormType {
  login = 'login',
  signup = 'signup',
  emailLogin = 'email-login',
}

// todo: remove this enum
export enum AuthenticationField {
  nick = 'nick',
  email = 'email',
  password = 'password',
  acceptRules = 'acceptRules',
}

export type AuthenticationForm = {
  [AuthenticationField.email]: string;
  [AuthenticationField.password]: string;
  [AuthenticationField.nick]: string;
  [AuthenticationField.acceptRules]: boolean;
};
