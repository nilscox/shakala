import { CommentReport } from 'backend-domain';

import {
  CommentReportRepository,
  FindCommentReportOptions,
} from '../../interfaces/repositories/comment-report.repository';
import { InMemoryRepository } from '../../utils/in-memory-repository';

export class InMemoryCommentReportRepository
  extends InMemoryRepository<CommentReport>
  implements CommentReportRepository
{
  async findBy({ commentId, reportedById }: FindCommentReportOptions): Promise<CommentReport | undefined> {
    return this.find((report) => report.commentId === commentId && report.reportedBy.id === reportedById);
  }
}
