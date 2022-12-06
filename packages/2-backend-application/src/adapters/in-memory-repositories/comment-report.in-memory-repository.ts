import { CommentReport } from 'backend-domain';

import { CommentReportRepository, FindCommentReportOptions } from '../../interfaces';
import { InMemoryRepository } from '../../utils';

export class InMemoryCommentReportRepository
  extends InMemoryRepository<CommentReport>
  implements CommentReportRepository
{
  protected entityName = 'commentReport';

  async findBy({ commentId, reportedById }: FindCommentReportOptions): Promise<CommentReport | undefined> {
    return this.find((report) => report.commentId === commentId && report.reportedBy.id === reportedById);
  }
}
