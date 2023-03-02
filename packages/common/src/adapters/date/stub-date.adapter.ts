import { Timestamp } from '../../entities/timestamp.value-object';

import { DatePort } from './date.port';

export class StubDateAdapter implements DatePort {
  constructor(private currentDate = new Timestamp(0)) {}

  now() {
    return this.currentDate;
  }
}
