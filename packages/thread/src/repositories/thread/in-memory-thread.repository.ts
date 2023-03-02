import { InMemoryRepository } from '@shakala/common';

import { Thread } from '../../entities/thread.entity';
import { GetLastThreadsQueryResult } from '../../queries/get-last-threads';
import { GetThreadQueryResult } from '../../queries/get-thread';

import { ThreadRepository } from './thread.repository';

export class InMemoryThreadRepository extends InMemoryRepository<Thread> implements ThreadRepository {
  entity = Thread;

  getLastThreads(): Promise<GetLastThreadsQueryResult> {
    throw new Error('Method not implemented.');
  }

  getThread(): Promise<GetThreadQueryResult | undefined> {
    throw new Error('Method not implemented.');
  }
}
