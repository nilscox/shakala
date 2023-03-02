import { InMemoryRepository } from '@shakala/common';

import { Comment } from '../../entities/comment.entity';
import { GetCommentResult } from '../../queries/get-comment';

import { CommentRepository } from './comment.repository';

export class InMemoryCommentRepository extends InMemoryRepository<Comment> implements CommentRepository {
  entity = Comment;

  getComment(): Promise<GetCommentResult | undefined> {
    throw new Error('Method not implemented.');
  }
}
