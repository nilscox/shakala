export const queryCreator = <T, R>(name?: string): QueryCreator<T, R> => {
  const symbol = Symbol(name);
  const createQuery = (query: T) => ({
    symbol,
    query,
    // only used for typing
    __result: undefined as never as R,
  });

  createQuery.symbol = symbol;

  return createQuery;
};

export interface QueryCreator<T, R> {
  (query: T): ExecutableQuery<T, R>;
  symbol: symbol;
}

export type ExecutableQuery<T = unknown, R = unknown> = {
  symbol: symbol;
  query: T;
  __result: R;
};

// prettier-ignore
export type QueryResult<Query extends ExecutableQuery<unknown, unknown>> =
  Query extends ExecutableQuery<unknown, infer R> ? R : never;
