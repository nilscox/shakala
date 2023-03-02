import { Repository } from '@shakala/common';

import { Thread } from '../../entities/thread.entity';
import { GetLastThreadsQueryResult } from '../../queries/get-last-threads';
import { GetThreadQueryResult } from '../../queries/get-thread';

export interface ThreadRepository extends Repository<Thread> {
  getLastThreads(count: number): Promise<GetLastThreadsQueryResult>;
  getThread(threadId: string): Promise<GetThreadQueryResult | undefined>;
}
