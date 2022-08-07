import { EntityManager } from '@mikro-orm/postgresql';
import { ThreadRepository } from 'backend-application';
import { Thread } from 'backend-domain';

import { BaseSqlRepository } from '../base-classes/base-sql-repository';
import { SqlThread } from '../entities/sql-thread.entity';

export class SqlThreadRepository extends BaseSqlRepository<SqlThread, Thread> implements ThreadRepository {
  constructor(em: EntityManager) {
    super(em, SqlThread);
  }

  protected get entityName(): string {
    return 'Thread';
  }

  async findLasts(count: number): Promise<Thread[]> {
    const threads = await this.findAll();

    return threads.reverse().slice(0, count);
  }
}
