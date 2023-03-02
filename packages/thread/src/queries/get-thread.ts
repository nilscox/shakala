import { queryCreator, QueryHandler } from '@shakala/common';

import { ThreadRepository } from '../repositories/thread/thread.repository';

import { GetCommentResult } from './get-comment';
import { GetLastThreadsQueryResult } from './get-last-threads';

export type GetThreadQuery = {
  threadId: string;
};

export type GetThreadQueryResult = GetLastThreadsQueryResult[number] & {
  comments: GetCommentResult[];
};

const symbol = Symbol('GetThread');
export const getThread = queryCreator<GetThreadQuery, GetThreadQueryResult>(symbol);

export class GetThreadQueryHandler implements QueryHandler<GetThreadQuery, GetThreadQueryResult | undefined> {
  symbol = symbol;

  constructor(private readonly threadRepository: ThreadRepository) {}

  async handle(query: GetThreadQuery): Promise<GetThreadQueryResult | undefined> {
    return this.threadRepository.getThread(query.threadId);
  }
}
