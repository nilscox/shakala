import { EmailBody } from '../../entities/email';
import { EmailKind, EmailPayloadMap } from '../../entities/emails-payloads';

export interface EmailRendererPort {
  init?(): Promise<void>;
  render<Kind extends EmailKind>(kind: Kind, payload: EmailPayloadMap[Kind]): EmailBody;
}
