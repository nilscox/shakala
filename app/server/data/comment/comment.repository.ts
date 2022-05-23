import { Sort } from '~/types';

import { CommentEntity } from './comment.entity';

export const CommentRepositoryToken = Symbol('CommentRepositoryToken');

export interface CommentRepository {
  findForThread(threadId: string, sort?: Sort, search?: string): Promise<CommentEntity[]>;
  findReplies(parentId: string): Promise<CommentEntity[]>;
  findById(commentId: string): Promise<CommentEntity | undefined>;
  save(comment: CommentEntity): Promise<void>;
}
