import { inject, injectable } from 'inversify';

import { Thread } from '~/server/thread/thread.entity';

import { InMemoryRepository } from '../in-memory.repository';

import { ThreadRepository } from './thread.repository';

@injectable()
export class InMemoryThreadRepository extends InMemoryRepository<Thread> implements ThreadRepository {
  constructor(@inject('threads') threads?: Thread[]) {
    super(threads);
  }

  async findLasts(count: number): Promise<Thread[]> {
    return this.all().slice(-count);
  }
}
