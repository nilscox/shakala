import type { Thread } from '@shakala/backend-domain';

import { Repository } from '../repository';

export interface ThreadRepository extends Repository<Thread> {
  findLasts(count: number): Promise<Thread[]>;
}
