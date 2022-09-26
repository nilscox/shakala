export type EmailBody = {
  text: string;
  html: string;
};

export type EmailPayload = Record<string, string>;

export type EmailRenderer = <Payload extends EmailPayload>(data: Payload) => EmailBody;

export interface EmailCompilerPort {
  compile(templateText: string, templateHtml: string): EmailRenderer;
}
