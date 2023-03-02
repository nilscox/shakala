import { queryCreator, QueryHandler } from '@shakala/common';

import { CommentRepository } from '../repositories/comment/comment.repository';

export type GetCommentQuery = {
  commentId: string;
  userId?: string;
};

export type GetCommentResult = {
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
};

const symbol = Symbol('GetComment');
export const getComment = queryCreator<GetCommentQuery, GetCommentResult>(symbol);

export class GetCommentHandler implements QueryHandler<GetCommentQuery, GetCommentResult | undefined> {
  symbol = symbol;

  constructor(private readonly commentRepository: CommentRepository) {}

  async handle(query: GetCommentQuery): Promise<GetCommentResult | undefined> {
    return this.commentRepository.getComment(query.commentId);
  }
}
