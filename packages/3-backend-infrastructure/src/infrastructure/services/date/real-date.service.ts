import { DateService } from 'backend-domain';

export class RealDateService implements DateService {
  now(): Date {
    return new Date();
  }

  nowAsString(): string {
    return this.now().toISOString();
  }
}
