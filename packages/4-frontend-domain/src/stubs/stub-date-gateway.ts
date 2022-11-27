import { DateGateway } from '../gateways/date-gateway';

export class StubDateGateway implements DateGateway {
  now = new Date('2000-01-01');

  setNow(now: Date) {
    this.now = now;
  }

  nowAsString(): string {
    return this.now.toISOString();
  }
}
