import { DateGateway } from 'frontend-domain/src/interfaces/date.gateway';

export class RealDateGateway implements DateGateway {
  now(): Date {
    return new Date();
  }
}
