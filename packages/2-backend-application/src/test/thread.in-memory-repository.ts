import { Thread } from 'backend-domain';

import { ThreadRepository } from '../interfaces/thread.repository';

import { InMemoryRepository } from './in-memory-repository';

export class InMemoryThreadRepository extends InMemoryRepository<Thread> implements ThreadRepository {
  async findLasts(count: number): Promise<Thread[]> {
    return this.all().slice(-count);
  }
}
