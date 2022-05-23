import { inject, injectable } from 'inversify';

import { InMemoryRepository } from '../in-memory.repository';

import { ThreadEntity } from './thread.entity';
import { ThreadRepository } from './thread.repository';

@injectable()
export class InMemoryThreadRepository extends InMemoryRepository<ThreadEntity> implements ThreadRepository {
  constructor(@inject('threads') threads?: ThreadEntity[]) {
    super(threads);
  }

  async findLasts(count: number): Promise<ThreadEntity[]> {
    return this.all().slice(-count);
  }
}
