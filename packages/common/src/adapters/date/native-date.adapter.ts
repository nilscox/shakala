import { Timestamp } from '../../entities/timestamp.value-object';

import { DatePort } from './date.port';

export class NativeDateAdapter implements DatePort {
  now(): Timestamp {
    return new Timestamp(new Date());
  }
}
