import { InMemoryRepository } from '@shakala/common';

import { CommentReport } from '../../entities/comment-report.entity';

import { CommentReportRepository, FindCommentReportOptions } from './comment-report.repository';

export class InMemoryCommentReportRepository
  extends InMemoryRepository<CommentReport>
  implements CommentReportRepository
{
  entity = CommentReport;

  async findBy({ commentId, reportedById }: FindCommentReportOptions): Promise<CommentReport | undefined> {
    return this.find((report) => report.commentId === commentId && report.reportedById === reportedById);
  }
}
