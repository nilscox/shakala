import type { DateService } from 'backend-domain';

export class StubDateService implements DateService {
  date = new Date();

  constructor() {
    beforeEach(() => {
      this.reset();
    });
  }

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
