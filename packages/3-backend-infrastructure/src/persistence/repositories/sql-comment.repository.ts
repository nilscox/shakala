import { EntityManager } from '@mikro-orm/postgresql';
import { CommentRepository, Sort } from '@shakala/backend-application';
import { Comment, DomainDependencies } from '@shakala/backend-domain';
import { groupBy } from '@shakala/shared';

import { BaseSqlRepository } from '../base-classes/base-sql-repository';
import { SqlComment } from '../entities/sql-comment.entity';

export class SqlCommentRepository
  extends BaseSqlRepository<SqlComment, Comment>
  implements CommentRepository
{
  constructor(em: EntityManager, deps: DomainDependencies) {
    super(em, deps, SqlComment);
  }

  protected get entityName(): string {
    return 'Comment';
  }

  async findRoots(threadId: string, sort: Sort, search?: string | undefined): Promise<Comment[]> {
    const qb = this.repository.createQueryBuilder('comment');

    void qb.select('comment.*');
    void qb.leftJoinAndSelect('comment.author', 'author');
    void qb.leftJoinAndSelect('comment.history', 'history');

    void qb.where({ thread: { id: threadId } });
    void qb.andWhere({ parent: { id: null } });

    if (sort === Sort.dateAsc) {
      void qb.orderBy({ createdAt: 'asc' });
    } else if (sort === Sort.dateDesc) {
      void qb.orderBy({ createdAt: 'desc' });
    }

    if (search) {
      void qb.andWhere({ history: { text: { $ilike: `%${search}%` } } });
    }

    return this.toDomain(await qb.getResult());
  }

  async findReplies(parentIds: string[]): Promise<Map<string, Comment[]>> {
    const replies = this.toDomain(await this.repository.find({ parent: { $in: parentIds } }));

    return groupBy(replies, 'parentId') as Map<string, Comment[]>;
  }
}
