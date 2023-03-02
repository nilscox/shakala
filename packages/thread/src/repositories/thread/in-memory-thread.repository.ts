import { InMemoryRepository } from '@shakala/common';

import { Thread } from '../../entities/thread.entity';

import { ThreadRepository } from './thread.repository';

export class InMemoryThreadRepository extends InMemoryRepository<Thread> implements ThreadRepository {
  entity = Thread;
}
