import { Query, QueryResult } from '../../cqs/query';

export interface QueryBus {
  execute<Q extends Query>(query: Q): Promise<QueryResult<Q>>;
}
