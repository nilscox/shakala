import { Repository } from '@shakala/common';
import { Maybe } from '@shakala/shared';

import { Thread } from '../../entities/thread.entity';
import { GetLastThreadsResult } from '../../queries/get-last-threads';
import { GetThreadResult } from '../../queries/get-thread';

export interface ThreadRepository extends Repository<Thread> {
  getLastThreads(count: number): Promise<GetLastThreadsResult>;
  getThread(threadId: string): Promise<Maybe<GetThreadResult>>;
}
