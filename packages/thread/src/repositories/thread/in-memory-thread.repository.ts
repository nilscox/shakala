import { InMemoryRepository } from '@shakala/common';

import { Thread } from '../../entities/thread.entity';
import { GetLastThreadsResult } from '../../queries/get-last-threads';
import { GetThreadResult } from '../../queries/get-thread';

import { ThreadRepository } from './thread.repository';

export class InMemoryThreadRepository extends InMemoryRepository<Thread> implements ThreadRepository {
  entity = Thread;

  getLastThreads(): Promise<GetLastThreadsResult> {
    throw new Error('Method not implemented.');
  }

  getThread(): Promise<GetThreadResult | undefined> {
    throw new Error('Method not implemented.');
  }
}
