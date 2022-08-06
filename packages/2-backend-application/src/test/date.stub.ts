import { DateService, Timestamp } from 'backend-domain';

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

  setNow(now: Date | Timestamp) {
    if (now instanceof Timestamp) {
      this.date = now.toDate();
    } else {
      this.date = now;
    }
  }

  now() {
    return this.date;
  }

  nowAsString() {
    return this.now().toISOString();
  }
}
