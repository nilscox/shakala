import { Repository } from '@shakala/common';

import { CommentReport } from '../../entities/comment-report.entity';

export type FindCommentReportOptions = {
  commentId: string;
  reportedById: string;
};

export interface CommentReportRepository extends Repository<CommentReport> {
  findBy(options: FindCommentReportOptions): Promise<CommentReport | undefined>;
}
