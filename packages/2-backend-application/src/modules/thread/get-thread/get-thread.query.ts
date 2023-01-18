import { Sort, ThreadWithCommentsDto } from '@shakala/shared';

import { Query, QueryHandler } from '../../../cqs';
import { ThreadRepository } from '../../../interfaces';

export class GetThreadQuery implements Query {
  constructor(
    public readonly threadId: string,
    public readonly sort: Sort,
    public readonly search?: string,
    public readonly userId?: string,
  ) {}
}

export class GetThreadHandler implements QueryHandler<GetThreadQuery, ThreadWithCommentsDto | undefined> {
  constructor(private readonly threadRepository: ThreadRepository) {}

  async handle(query: GetThreadQuery): Promise<ThreadWithCommentsDto | undefined> {
    return this.threadRepository.findThread(query.threadId, query.sort, query.search, query.userId);
  }
}
