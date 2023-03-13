import assert from 'assert';

import { ExecutableQuery, QueryResult } from '../../cqs/query';

import { QueryBus } from './query-bus.port';

export class StubQueryBus extends Array<unknown> implements QueryBus {
  private results = new Map<symbol, Map<string, unknown>>();

  on<Query extends ExecutableQuery>({ symbol, query }: Query) {
    const queryResults = this.results.get(symbol) ?? new Map<string, unknown>();

    if (!this.results.has(symbol)) {
      this.results.set(symbol, queryResults);
    }

    return {
      return(result: QueryResult<Query> | unknown) {
        queryResults.set(JSON.stringify(query), result);
      },
    };
  }

  async execute<Q extends ExecutableQuery>({ symbol, query }: Q): Promise<QueryResult<Q>> {
    this.push(query);

    const queryResults = this.results.get(symbol);

    assert(
      queryResults && queryResults.has(JSON.stringify(query)),
      `No result found for query ${String(symbol)} ${JSON.stringify(query)}`
    );

    return queryResults.get(JSON.stringify(query)) as QueryResult<Q>;
  }
}
