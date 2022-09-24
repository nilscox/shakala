import { CommentReport } from 'backend-domain';

import { Repository } from '../repository';

export type FindCommentReportOptions = {
  commentId: string;
  reportedById: string;
};

export interface CommentReportRepository extends Repository<CommentReport> {
  findBy(options: FindCommentReportOptions): Promise<CommentReport | undefined>;
}
