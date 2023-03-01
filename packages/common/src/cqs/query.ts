export type Query<T = unknown, R = unknown> = T & {
  __symbol: symbol;
  __result: R; // only used for typing
};

export const queryCreator = <T, R>(symbol: symbol) => {
  return (query: T): Query<T, R> => ({
    __symbol: symbol,
    __result: undefined as never,
    ...query,
  });
};

export type QueryResult<Q extends Query> = Q extends Query<unknown, infer Result> ? Result : never;
