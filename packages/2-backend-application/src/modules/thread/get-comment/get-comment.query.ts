import { Comment } from '@shakala/backend-domain';

import { Query, QueryHandler } from '../../../cqs';
import { CommentRepository } from '../../../interfaces';

export class GetCommentQuery implements Query {
  constructor(public readonly commentId: string, public readonly userId?: string) {}
}

export class GetCommentQueryHandler implements QueryHandler<GetCommentQuery, Comment | undefined> {
  constructor(private readonly commentRepository: CommentRepository) {}

  async handle(query: GetCommentQuery): Promise<Comment | undefined> {
    return this.commentRepository.findById(query.commentId);
  }
}
