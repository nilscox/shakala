import { DateGateway } from '@shakala/frontend-domain';

export class RealDateGateway implements DateGateway {
  nowAsString(): string {
    return new Date().toISOString();
  }
}
