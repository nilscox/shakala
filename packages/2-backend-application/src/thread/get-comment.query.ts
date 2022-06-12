import { Comment } from 'backend-domain';

import { Query, QueryHandler } from '../cqs/query-handler';
import { CommentRepository } from '../interfaces/comment.repository';

export class GetCommentQuery implements Query {
  constructor(public readonly commentId: string) {}
}

export class GetCommentQueryHandler implements QueryHandler<GetCommentQuery, Comment | undefined> {
  constructor(private readonly commentRepository: CommentRepository) {}

  async handle(query: GetCommentQuery): Promise<Comment | undefined> {
    return this.commentRepository.findById(query.commentId);
  }
}
