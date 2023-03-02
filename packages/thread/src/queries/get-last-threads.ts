import { queryCreator, QueryHandler } from '@shakala/common';

import { ThreadRepository } from '../repositories/thread/thread.repository';

export type GetLastThreadsQuery = {
  count: number;
};

export type GetLastThreadsResult = Array<{
  id: string;
  author: {
    id: string;
    nick: string;
    profileImage?: string;
  };
  description: string;
  keywords: string[];
  text: string;
  date: string;
}>;

const symbol = Symbol('GetLastThreads');
export const getLastThreads = queryCreator<GetLastThreadsQuery, GetLastThreadsResult>(symbol);

export class GetLastThreadsHandler implements QueryHandler<GetLastThreadsQuery, GetLastThreadsResult> {
  symbol = symbol;

  constructor(private readonly threadRepository: ThreadRepository) {}

  async handle(query: GetLastThreadsQuery): Promise<GetLastThreadsResult> {
    return this.threadRepository.getLastThreads(query.count);
  }
}
