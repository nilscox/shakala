import assert from 'assert';

import { Query, QueryResult } from '../../cqs/query';
import { QueryHandler } from '../../cqs/query-handler';

import { QueryBus } from './query-bus.port';

export class LocalQueryBus implements QueryBus {
  private handlers = new Map<symbol, QueryHandler<unknown, unknown>>();

  register(handler: QueryHandler<unknown, unknown>) {
    this.handlers.set(handler.symbol, handler);
  }

  async execute<Q extends Query>({ __symbol, ...query }: Q): Promise<QueryResult<Q>> {
    const handler = this.handlers.get(__symbol);

    assert(handler, `No handler found for query ${String(__symbol)}`);

    return handler.handle(query) as Promise<QueryResult<Q>>;
  }
}
