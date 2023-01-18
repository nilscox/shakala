import { ThreadDto } from '@shakala/shared';

import { Query, QueryHandler } from '../../../cqs';
import { ThreadRepository } from '../../../interfaces';

export class GetLastThreadsQuery implements Query {
  constructor(public readonly count: number) {}
}

export class GetLastThreadsHandler implements QueryHandler<GetLastThreadsQuery, ThreadDto[]> {
  constructor(private readonly threadRepository: ThreadRepository) {}

  async handle(query: GetLastThreadsQuery): Promise<ThreadDto[]> {
    return this.threadRepository.findLasts(query.count);
  }
}
