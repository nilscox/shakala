import { DatePort } from 'backend-domain';

export class RealDateAdapter implements DatePort {
  now(): Date {
    return new Date();
  }

  nowAsString(): string {
    return this.now().toISOString();
  }
}
