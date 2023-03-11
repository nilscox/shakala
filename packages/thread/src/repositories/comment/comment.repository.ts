import { Repository } from '@shakala/common';

import { Comment } from '../../entities/comment.entity';
import { GetCommentResult } from '../../queries/get-comment';

export interface CommentRepository extends Repository<Comment> {
  getComment(id: string, userId?: string): Promise<GetCommentResult>;
}
