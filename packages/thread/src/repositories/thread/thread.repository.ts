import { Repository } from '@shakala/common';
import { CommentSort, Maybe } from '@shakala/shared';

import { Thread } from '../../entities/thread.entity';
import { GetLastThreadsResult } from '../../queries/get-last-threads';
import { GetThreadResult } from '../../queries/get-thread';

export type GetThreadOptions = {
  userId?: string;
  sort: CommentSort;
  search?: string;
};

export interface ThreadRepository extends Repository<Thread> {
  getLastThreads(count: number): Promise<GetLastThreadsResult>;
  getThread(threadId: string, options: GetThreadOptions): Promise<Maybe<GetThreadResult>>;
}
