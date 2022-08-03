import { EntityManager } from '@mikro-orm/postgresql';
import { ThreadRepository } from 'backend-application';
import { Markdown, Thread, Timestamp } from 'backend-domain';

import { EntityMapper } from '../base-classes/entity-mapper';
import { SqlRepository } from '../base-classes/sql-repository';
import { Thread as SqlThread } from '../entities/sql-thread.entity';
import { User as SqlUser } from '../entities/sql-user.entity';

import { UserEntityMapper } from './sql-user.repository';

export class SqlThreadRepository extends SqlRepository<SqlThread, Thread> implements ThreadRepository {
  constructor(em: EntityManager) {
    super(em.getRepository(SqlThread), new ThreadEntityMapper(em));
  }

  async findLasts(count: number): Promise<Thread[]> {
    const threads = await this.findAll();

    return threads.reverse().slice(0, count);
  }
}

class ThreadEntityMapper implements EntityMapper<SqlThread, Thread> {
  private userMapper = new UserEntityMapper();

  constructor(private readonly em: EntityManager) {}

  toSql(entity: Thread): SqlThread {
    const sqlThread = new SqlThread();

    sqlThread.id = entity.id;
    sqlThread.text = entity.text.toString();
    sqlThread.author = this.em.getReference(SqlUser, entity.author.id);
    sqlThread.created = entity.created.toDate();

    return sqlThread;
  }

  fromSql(sqlEntity: SqlThread): Thread {
    return new Thread({
      id: sqlEntity.id,
      text: new Markdown(sqlEntity.text),
      author: this.userMapper.fromSql(sqlEntity.author),
      created: new Timestamp(sqlEntity.created),
    });
  }
}
