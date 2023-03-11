import { queryCreator, QueryHandler, registerQuery } from '@shakala/common';
import { Maybe } from '@shakala/shared';
import { injected } from 'brandi';

import { CommentRepository } from '../repositories/comment/comment.repository';
import { THREAD_TOKENS } from '../tokens';

export type GetCommentQuery = {
  commentId: string;
  userId?: string;
};

export type GetCommentResult = Maybe<{
  id: string;
  author: {
    id: string;
    nick: string;
    profileImage?: string;
  };
  text: string;
  date: string;
  edited: string | false;
  history: Array<{
    date: string;
    text: string;
  }>;
  upvotes: number;
  downvotes: number;
  userReaction?: 'upvote' | 'downvote';
  isSubscribed?: boolean;
  replies: Array<Omit<GetCommentResult, 'replies'>>;
}>;

export const getComment = queryCreator<GetCommentQuery, GetCommentResult>('getComment');

export class GetCommentHandler implements QueryHandler<GetCommentQuery, GetCommentResult> {
  constructor(private readonly commentRepository: CommentRepository) {}

  async handle(query: GetCommentQuery): Promise<GetCommentResult> {
    return this.commentRepository.getComment(query.commentId, query.userId);
  }
}

injected(GetCommentHandler, THREAD_TOKENS.repositories.commentRepository);
registerQuery(getComment, THREAD_TOKENS.queries.getCommentHandler);
