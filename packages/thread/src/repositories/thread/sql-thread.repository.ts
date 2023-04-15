import { Timestamp } from '@shakala/common';
import { PERSISTENCE_TOKENS, SqlRepository, SqlThread, SqlUser } from '@shakala/persistence';
import { getIds } from '@shakala/shared';
import { injected } from 'brandi';

import { Markdown } from '../../entities/markdown.value-object';
import { Thread } from '../../entities/thread.entity';
import { GetLastThreadsResult } from '../../queries/get-last-threads';
import { GetThreadResult } from '../../queries/get-thread';

import { ThreadRepository } from './thread.repository';

export class SqlThreadRepository extends SqlRepository<Thread, SqlThread> implements ThreadRepository {
  SqlEntity = SqlThread;

  protected toEntity(sqlEntity: SqlThread): Thread {
    return new Thread({
      id: sqlEntity.id,
      description: sqlEntity.description,
      text: new Markdown(sqlEntity.text),
      keywords: sqlEntity.keywords,
      authorId: sqlEntity.author.id,
      created: new Timestamp(sqlEntity.createdAt),
    });
  }

  protected toSql(thread: Thread) {
    return this.em.create(SqlThread, {
      id: thread.id,
      description: thread.description,
      text: thread.text.toString(),
      keywords: thread.keywords,
      author: this.em.getReference(SqlUser, thread.authorId),
      createdAt: thread.created.toDate(),
    } as SqlThread);
  }

  async getLastThreads(count: number): Promise<GetLastThreadsResult> {
    const sqlThreads = await this.repository.findAll({ populate: ['author'], limit: count });
    const totalComments = await this.countComments(getIds(sqlThreads));

    return sqlThreads.map((sqlThread) =>
      this.mapThreadResult(sqlThread, totalComments.get(sqlThread.id) ?? 0)
    );
  }

  async getThread(threadId: string): Promise<GetThreadResult | undefined> {
    const sqlThread = await this.repository.findOne(threadId, { populate: ['author'] });

    if (!sqlThread) {
      return undefined;
    }

    const totalCommentsMap = await this.countComments([threadId]);
    const totalComments = totalCommentsMap.get(threadId);

    return this.mapThreadResult(sqlThread, totalComments ?? 0);
  }

  private async countComments(threadIds: string[]): Promise<Map<string, number>> {
    const results: Array<{ thread_id: string; count: string }> = await this.em.execute(
      `select thread_id, count(id) from comment where thread_id in (?) group by thread_id`,
      [threadIds]
    );

    return new Map(results.map(({ thread_id, count }) => [thread_id, Number(count)]));
  }

  private mapThreadResult(sqlThread: SqlThread, totalComments: number): GetLastThreadsResult[number] {
    return {
      id: sqlThread.id,
      author: {
        id: sqlThread.author.id,
        nick: sqlThread.author.nick,
        profileImage: `/user/${sqlThread.author.id}/profile-image`,
      },
      description: sqlThread.description,
      keywords: sqlThread.keywords,
      text: sqlThread.text,
      date: sqlThread.createdAt.toISOString(),
      totalComments,
    };
  }
}

injected(SqlThreadRepository, PERSISTENCE_TOKENS.database);
