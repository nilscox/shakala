import { InMemoryRepository } from '@shakala/common';

import { Comment } from '../../entities/comment.entity';

import { CommentRepository } from './comment.repository';

export class InMemoryCommentRepository extends InMemoryRepository<Comment> implements CommentRepository {
  entity = Comment;
}
