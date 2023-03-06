import { ExecutableQuery, QueryResult } from '../../cqs/query';

export interface QueryBus {
  execute<Q extends ExecutableQuery<unknown, unknown>>(query: Q): Promise<QueryResult<Q>>;
}
