import { queryCreator, QueryHandler } from '@shakala/common';

import { ThreadRepository } from '../repositories/thread/thread.repository';

export type GetLastThreadsQuery = {
  count: number;
};

export type GetLastThreadsQueryResult = Array<{
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
export const getLastThreads = queryCreator<GetLastThreadsQuery, GetLastThreadsQueryResult>(symbol);

export class GetLastThreadsQueryHandler
  implements QueryHandler<GetLastThreadsQuery, GetLastThreadsQueryResult>
{
  symbol = symbol;

  constructor(private readonly threadRepository: ThreadRepository) {}

  async handle(query: GetLastThreadsQuery): Promise<GetLastThreadsQueryResult> {
    return this.threadRepository.getLastThreads(query.count);
  }
}
