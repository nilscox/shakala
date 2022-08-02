import type { Thread } from 'backend-domain';

import { Repository } from './repository';

export interface ThreadRepository extends Repository<Thread> {
  findLasts(count: number): Promise<Thread[]>;
}
