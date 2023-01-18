import { Thread } from '@shakala/backend-domain';
import { ThreadDto, ThreadWithCommentsDto } from '@shakala/shared/src';

import { ThreadRepository } from '../../interfaces';
import { InMemoryRepository } from '../../utils';

export class InMemoryThreadRepository extends InMemoryRepository<Thread> implements ThreadRepository {
  protected entityName = 'thread';

  findLasts(): Promise<ThreadDto[]> {
    throw new Error('Method not implemented.');
  }

  findThread(): Promise<ThreadWithCommentsDto | undefined> {
    throw new Error('Method not implemented.');
  }
}
