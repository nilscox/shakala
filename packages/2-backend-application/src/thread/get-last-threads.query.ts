import { Thread } from 'backend-domain';

import { Query, QueryHandler } from '../cqs/query-handler';
import { ThreadRepository } from '../interfaces/repositories';

export class GetLastThreadsQuery implements Query {
  constructor(public readonly count: number) {}
}

export class GetLastThreadsHandler implements QueryHandler<GetLastThreadsQuery, Thread[]> {
  constructor(private readonly threadRepository: ThreadRepository) {}

  async handle(query: GetLastThreadsQuery): Promise<Thread[]> {
    return this.threadRepository.findLasts(query.count);
  }
}
