import {
  PERSISTENCE_TOKENS,
  SqlComment,
  SqlCommentReport,
  SqlRepository,
  SqlUser,
} from '@shakala/persistence';
import { injected } from 'brandi';

import { CommentReport } from '../../entities/comment-report.entity';

import { CommentReportRepository, FindCommentReportOptions } from './comment-report.repository';

export class SqlCommentReportRepository
  extends SqlRepository<CommentReport, SqlCommentReport>
  implements CommentReportRepository
{
  SqlEntity = SqlCommentReport;

  protected toEntity(sqlCommentReport: SqlCommentReport): CommentReport {
    return new CommentReport({
      id: sqlCommentReport.id,
      commentId: sqlCommentReport.comment.id,
      reportedById: sqlCommentReport.reportedBy.id,
      reason: sqlCommentReport.reason ?? undefined,
    });
  }

  protected toSql(commentReport: CommentReport): SqlCommentReport {
    return Object.assign(new SqlCommentReport(), {
      id: commentReport.id,
      comment: this.em.getReference(SqlComment, commentReport.commentId),
      user: this.em.getReference(SqlUser, commentReport.reportedById),
      reason: commentReport.reason ?? null,
    });
  }

  async findBy(options: FindCommentReportOptions): Promise<CommentReport | undefined> {
    const sqlCommentReport = await this.repository.findOne({
      comment: options.commentId,
      reportedBy: options.reportedById,
    });

    if (sqlCommentReport) {
      return this.toEntity(sqlCommentReport);
    }
  }
}

injected(SqlCommentReportRepository, PERSISTENCE_TOKENS.database);
