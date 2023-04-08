import assert from 'assert';

import { Container, injected } from 'brandi';

import { ExecutableQuery, QueryResult } from '../../cqs/query';

import { QueryBus } from './query-bus.port';
import { getQueryHandlerToken } from './register-query';

export class LocalQueryBus implements QueryBus {
  private container?: Container;

  setContainer(container: Container) {
    this.container = container;
  }

  async execute<Q extends ExecutableQuery>({ symbol, query }: Q): Promise<QueryResult<Q>> {
    assert(this.container);

    const handler = this.container.get(getQueryHandlerToken(symbol));

    assert(handler, `No handler found for query ${String(symbol)}`);

    return handler.handle(query) as Promise<QueryResult<Q>>;
  }
}

injected(LocalQueryBus);
