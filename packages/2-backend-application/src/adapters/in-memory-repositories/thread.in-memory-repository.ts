import { Thread } from '@shakala/backend-domain';

import { ThreadRepository } from '../../interfaces';
import { InMemoryRepository } from '../../utils';

export class InMemoryThreadRepository extends InMemoryRepository<Thread> implements ThreadRepository {
  protected entityName = 'thread';

  async findLasts(count: number): Promise<Thread[]> {
    return this.all().slice(-count);
  }
}
