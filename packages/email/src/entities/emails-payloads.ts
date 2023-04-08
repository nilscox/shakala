export enum EmailKind {
  welcome = 'welcome',
}

export type EmailPayloadMap = {
  [EmailKind.welcome]: {
    appBaseUrl: string;
    nick: string;
    emailValidationLink: string;
  };
};
