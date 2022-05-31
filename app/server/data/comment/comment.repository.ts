import { Sort } from '~/types';

import { Comment } from '../../thread/comment.entity';

export const CommentRepositoryToken = Symbol('CommentRepositoryToken');

export interface CommentRepository {
  findForThread(threadId: string, sort?: Sort, search?: string): Promise<Comment[]>;
  findReplies(parentId: string): Promise<Comment[]>;
  findById(commentId: string): Promise<Comment | undefined>;
  save(comment: Comment): Promise<void>;
}
