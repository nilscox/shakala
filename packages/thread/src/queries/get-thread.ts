import { queryCreator, QueryHandler, registerQuery } from '@shakala/common';
import { injected } from 'brandi';

import { ThreadRepository } from '../repositories/thread/thread.repository';
import { THREAD_TOKENS } from '../tokens';

export type GetThreadQuery = {
  threadId: string;
};

export type GetThreadResult = {
  id: string;
  author: {
    id: string;
    nick: string;
    profileImage: string;
  };
  description: string;
  keywords: string[];
  text: string;
  date: string;
  totalComments: number;
};

export const getThread = queryCreator<GetThreadQuery, GetThreadResult | undefined>('getThread');

export class GetThreadHandler implements QueryHandler<GetThreadQuery, GetThreadResult | undefined> {
  constructor(private readonly threadRepository: ThreadRepository) {}

  async handle(query: GetThreadQuery): Promise<GetThreadResult | undefined> {
    return this.threadRepository.getThread(query.threadId);
  }
}

injected(GetThreadHandler, THREAD_TOKENS.repositories.threadRepository);
registerQuery(getThread, THREAD_TOKENS.queries.getThreadHandler);
