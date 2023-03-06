import assert from 'assert';

import { Token } from 'brandi';

import { QueryCreator } from '../../cqs/query';
import { QueryHandler } from '../../cqs/query-handler';

const queryHandlers: Record<symbol, Token<QueryHandler<unknown, unknown>>> = {};

export const registerQuery = <Query, Result>(
  creator: QueryCreator<Query, Result>,
  token: Token<QueryHandler<Query, Result>>
) => {
  const symbol = creator.symbol;

  assert(!queryHandlers[symbol], `Handler already registered for query ${String(symbol)}`);

  queryHandlers[symbol] = token;
};

export const getQueryHandlerToken = (symbol: symbol) => {
  const handler = queryHandlers[symbol];

  assert(handler, `No handler found for query ${String(symbol)}`);

  return handler;
};
