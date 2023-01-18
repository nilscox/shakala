import { EntityManager } from '@mikro-orm/postgresql';
import { CommentRepository, ThreadRepository } from '@shakala/backend-application';
import { DomainDependencies, Thread } from '@shakala/backend-domain';
import { Sort, ThreadDto, ThreadWithCommentsDto } from '@shakala/shared';

import { BaseSqlRepository } from '../base-classes/base-sql-repository';
import { SqlThread } from '../entities/sql-thread.entity';

export class SqlThreadRepository extends BaseSqlRepository<SqlThread, Thread> implements ThreadRepository {
  constructor(
    em: EntityManager,
    deps: DomainDependencies,
    private readonly commentRepository: CommentRepository,
  ) {
    super(em, deps, SqlThread);
  }

  protected get entityName(): string {
    return 'Thread';
  }

  async findLasts(count: number): Promise<ThreadDto[]> {
    const threads = await this.repository.findAll({ limit: count, orderBy: { createdAt: 'desc' } });

    return threads.map((thread) => this.threadToDto(thread));
  }

  async findThread(
    threadId: string,
    sortComments: Sort,
    search?: string,
    userId?: string,
  ): Promise<ThreadWithCommentsDto | undefined> {
    const thread = await this.em.findOne(SqlThread, threadId);

    if (!thread) {
      return;
    }

    return {
      id: thread.id,
      date: thread.createdAt.toISOString(),
      author: {
        id: thread.author.id,
        nick: thread.author.nick,
        profileImage: thread.author.profileImage ?? undefined,
      },
      description: thread.description,
      keywords: thread.keywords,
      text: thread.text,
      comments: await this.commentRepository.findThreadComments(thread.id, sortComments, search, userId),
    };
  }

  private threadToDto(thread: SqlThread): ThreadDto {
    return {
      id: thread.id,
      date: thread.createdAt.toISOString(),
      author: {
        id: thread.author.id,
        nick: thread.author.nick,
        profileImage: thread.author.profileImage ?? undefined,
      },
      description: thread.description,
      keywords: thread.keywords,
      text: thread.text,
    };
  }
}
