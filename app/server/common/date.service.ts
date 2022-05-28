import { injectable } from 'inversify';

export const DateServiceToken = Symbol('DateServiceToken');

export interface DateService {
  now(): Date;
  nowAsString(): string;
}

@injectable()
export class RealDateService {
  now() {
    return new Date();
  }

  nowAsString() {
    return this.now().toISOString();
  }
}

export class StubDateService {
  date = new Date();

  reset() {
    this.date = new Date();
  }

  setNow(now: Date) {
    this.date = now;
  }

  now() {
    return this.date;
  }

  nowAsString() {
    return this.now().toISOString();
  }
}
