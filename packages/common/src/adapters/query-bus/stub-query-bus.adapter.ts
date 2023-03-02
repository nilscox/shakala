import { Query, QueryResult } from '../../cqs/query';

import { QueryBus } from './query-bus.port';

export class StubQueryBus extends Array<Query> implements QueryBus {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private results = new Map<string, any>();

  register<Q extends Query>(query: Q, result: QueryResult<Q>) {
    this.results.set(JSON.stringify(query), result);
  }

  async execute<Q extends Query>(query: Q): Promise<QueryResult<Q>> {
    this.push(query);
    return this.results.get(JSON.stringify(query)) as QueryResult<Q>;
  }
}
