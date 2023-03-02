import { Repository } from '@shakala/common';

import { Comment } from '../../entities/comment.entity';
import { GetCommentResult } from '../../queries/get-comment';

// todo: rename to CommentSort
export enum Sort {
  dateAsc = 'date-asc',
  dateDesc = 'date-desc',
  relevance = 'relevance',
}

export interface CommentRepository extends Repository<Comment> {
  getComment(id: string): Promise<GetCommentResult | undefined>;
}
