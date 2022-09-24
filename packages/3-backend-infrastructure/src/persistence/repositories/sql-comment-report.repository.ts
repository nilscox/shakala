import { EntityManager } from '@mikro-orm/postgresql';
import {
  CommentReportRepository,
  FindCommentReportOptions,
} from 'backend-application/src/interfaces/repositories/comment-report.repository';
import { CommentReport, DomainDependencies } from 'backend-domain';

import { BaseSqlRepository } from '../base-classes/base-sql-repository';
import { SqlCommentReport } from '../entities/sql-comment-report.entity';

export class SqlCommentReportRepository
  extends BaseSqlRepository<SqlCommentReport, CommentReport>
  implements CommentReportRepository
{
  constructor(em: EntityManager, deps: DomainDependencies) {
    super(em, deps, SqlCommentReport);
  }

  protected get entityName(): string {
    return 'CommentReport';
  }

  async findBy({ commentId, reportedById }: FindCommentReportOptions): Promise<CommentReport | undefined> {
    const sqlEntity = await this.repository.findOne({
      comment: { id: commentId },
      reportedBy: { id: reportedById },
    });

    return this.toDomain(sqlEntity);
  }
}
