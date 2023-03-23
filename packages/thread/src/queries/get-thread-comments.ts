import { queryCreator, QueryHandler, registerQuery } from '@shakala/common';
import { CommentSort } from '@shakala/shared';
import { injected } from 'brandi';

import { CommentRepository } from '../repositories/comment/comment.repository';
import { THREAD_TOKENS } from '../tokens';

import { GetCommentResult } from './get-comment';

export type GetThreadCommentsQuery = {
  threadId: string;
  userId?: string;
  sort: CommentSort;
  search?: string;
};

export const getThreadComments = queryCreator<GetThreadCommentsQuery, GetCommentResult[]>(
  'getThreadComments'
);

export class GetThreadCommentsHandler implements QueryHandler<GetThreadCommentsQuery, GetCommentResult[]> {
  constructor(private readonly commentRepository: CommentRepository) {}

  async handle(query: GetThreadCommentsQuery): Promise<GetCommentResult[]> {
    return this.commentRepository.findThreadComments(query.threadId, query);
  }
}

injected(GetThreadCommentsHandler, THREAD_TOKENS.repositories.commentRepository);
registerQuery(getThreadComments, THREAD_TOKENS.queries.getThreadCommentsHandler);
