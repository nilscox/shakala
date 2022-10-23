import { Timestamp } from '../entities/timestamp.value-object';
import { DatePort } from '../interfaces/date.interface';

export class StubDateAdapter implements DatePort {
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
