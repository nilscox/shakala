import { Timestamp } from '../../entities/timestamp.value-object';

export interface DatePort {
  now(): Timestamp;
}
