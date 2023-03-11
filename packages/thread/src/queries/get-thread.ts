import { queryCreator, QueryHandler, registerQuery } from '@shakala/common';
import { CommentSort, Maybe } from '@shakala/shared';
import { injected } from 'brandi';

import { ThreadRepository } from '../repositories/thread/thread.repository';
import { THREAD_TOKENS } from '../tokens';

import { GetCommentResult } from './get-comment';
import { GetLastThreadsResult } from './get-last-threads';

export type GetThreadQuery = {
  threadId: string;
  userId?: string;
  sort: CommentSort;
  search?: string;
};

export type GetThreadResult = Maybe<GetLastThreadsResult[number] & { comments: GetCommentResult[] }>;

export const getThread = queryCreator<GetThreadQuery, GetThreadResult>('getThread');

export class GetThreadHandler implements QueryHandler<GetThreadQuery, GetThreadResult> {
  constructor(private readonly threadRepository: ThreadRepository) {}

  async handle(query: GetThreadQuery): Promise<GetThreadResult> {
    return this.threadRepository.getThread(query.threadId, {
      userId: query.userId,
      ...query,
    });
  }
}

injected(GetThreadHandler, THREAD_TOKENS.repositories.threadRepository);
registerQuery(getThread, THREAD_TOKENS.queries.getThreadHandler);
