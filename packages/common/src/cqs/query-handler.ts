export interface QueryHandler<Query, Result> {
  symbol: symbol;
  handle(query: Query): Promise<Result>;
}
