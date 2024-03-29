import { queryCreator, QueryHandler, registerQuery } from '@shakala/common';
import { Maybe, ReactionType } from '@shakala/shared';
import { injected } from 'brandi';

import { CommentRepository } from '../repositories/comment/comment.repository';
import { THREAD_TOKENS } from '../tokens';

export type GetCommentQuery = {
  commentId: string;
  userId?: string;
};

export type GetCommentResult = {
  id: string;
  threadId: string;
  author: {
    id: string;
    nick: string;
    profileImage: string;
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
  userReaction?: ReactionType;
  isSubscribed?: boolean;
  replies: Array<Omit<GetCommentResult, 'replies'>>;
};

export const getComment = queryCreator<GetCommentQuery, Maybe<GetCommentResult>>('getComment');

export class GetCommentHandler implements QueryHandler<GetCommentQuery, Maybe<GetCommentResult>> {
  constructor(private readonly commentRepository: CommentRepository) {}

  async handle(query: GetCommentQuery): Promise<Maybe<GetCommentResult>> {
    return this.commentRepository.findComment(query.commentId, query.userId);
  }
}

injected(GetCommentHandler, THREAD_TOKENS.repositories.commentRepository);
registerQuery(getComment, THREAD_TOKENS.queries.getCommentHandler);
