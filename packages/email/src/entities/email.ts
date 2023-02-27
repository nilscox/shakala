export type Email = {
  to: string;
  subject: string;
  body: EmailBody;
};

export type EmailBody = {
  text: string;
  html: string;
};

export type EmailPayload = Record<string, string>;

export type EmailRenderer = <Payload extends EmailPayload>(data: Payload) => EmailBody;
