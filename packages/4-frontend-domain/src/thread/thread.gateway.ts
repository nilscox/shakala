import { Thread } from '../types';

export interface ThreadGateway {
  getLast(count: number): Promise<Thread[]>;
}
