import { Thread } from 'backend-domain';

import { ThreadRepository } from '../../interfaces/repositories';
import { InMemoryRepository } from '../../utils/in-memory-repository';

export class InMemoryThreadRepository extends InMemoryRepository<Thread> implements ThreadRepository {
  async findLasts(count: number): Promise<Thread[]> {
    return this.all().slice(-count);
  }
}
