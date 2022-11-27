import { DateGateway } from 'frontend-domain';

export class RealDateGateway implements DateGateway {
  nowAsString(): string {
    return new Date().toISOString();
  }
}
