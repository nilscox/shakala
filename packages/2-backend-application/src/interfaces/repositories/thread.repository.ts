import type { Thread } from '@shakala/backend-domain';
import { Sort, ThreadDto, ThreadWithCommentsDto } from '@shakala/shared';

import { Repository } from '../repository';

export interface ThreadRepository extends Repository<Thread> {
  findLasts(count: number): Promise<ThreadDto[]>;
  findThread(
    threadId: string,
    sort: Sort,
    search?: string,
    userId?: string,
  ): Promise<ThreadWithCommentsDto | undefined>;
}
