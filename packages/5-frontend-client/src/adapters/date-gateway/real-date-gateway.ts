import { DateGateway } from 'frontend-domain';

export class RealDateGateway implements DateGateway {
  now(): Date {
    return new Date();
  }
}
