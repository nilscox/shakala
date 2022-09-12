type EmailBody = {
  text: string;
  html: string;
};

export type EmailPayload = Record<string, string>;

export type EmailRenderer = <Payload extends EmailPayload>(data: Payload) => EmailBody;

export type Email = {
  from: string;
  to: string;
  subject: string;
  body: EmailBody;
};

export interface EmailService {
  compile(templateText: string, templateHtml: string): EmailRenderer;
  send(email: Email): Promise<void>;
}
