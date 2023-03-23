import { Repository } from '@shakala/common';
import { CommentSort, Maybe } from '@shakala/shared';

import { Comment } from '../../entities/comment.entity';
import { GetCommentResult } from '../../queries/get-comment';

export type GetCommentsOptions = {
  userId?: string;
  sort: CommentSort;
  search?: string;
};

export interface CommentRepository extends Repository<Comment> {
  findComment(commentId: string, userId?: string): Promise<Maybe<GetCommentResult>>;
  findThreadComments(threadId: string, options: GetCommentsOptions): Promise<GetCommentResult[]>;
}
