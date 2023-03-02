import { queryCreator, QueryHandler } from '@shakala/common';

import { ThreadRepository } from '../repositories/thread/thread.repository';

import { GetCommentResult } from './get-comment';
import { GetLastThreadsResult } from './get-last-threads';

export type GetThreadQuery = {
  threadId: string;
};

export type GetThreadResult = GetLastThreadsResult[number] & {
  comments: GetCommentResult[];
};

const symbol = Symbol('GetThread');
export const getThread = queryCreator<GetThreadQuery, GetThreadResult>(symbol);

export class GetThreadHandler implements QueryHandler<GetThreadQuery, GetThreadResult | undefined> {
  symbol = symbol;

  constructor(private readonly threadRepository: ThreadRepository) {}

  async handle(query: GetThreadQuery): Promise<GetThreadResult | undefined> {
    return this.threadRepository.getThread(query.threadId);
  }
}
