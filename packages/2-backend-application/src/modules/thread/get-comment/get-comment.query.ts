import { Comment } from '@shakala/backend-domain';

import { Query, QueryHandler } from '../../../cqs';
import { CommentRepository } from '../../../interfaces';

export class GetCommentQuery implements Query {
  constructor(public readonly commentId: string, public readonly userId?: string) {}
}

export type GetCommentQueryResult = {
  comment: Comment;
  replies: Comment[];
};

export class GetCommentQueryHandler
  implements QueryHandler<GetCommentQuery, GetCommentQueryResult | undefined>
{
  constructor(private readonly commentRepository: CommentRepository) {}

  async handle(query: GetCommentQuery): Promise<GetCommentQueryResult | undefined> {
    const comment = await this.commentRepository.findById(query.commentId);

    if (!comment) {
      return;
    }

    const replies = await this.commentRepository.findReplies([comment.id]);

    return {
      comment,
      replies: replies.get(comment.id) ?? [],
    };
  }
}
