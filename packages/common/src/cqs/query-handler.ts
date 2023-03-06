export interface QueryHandler<Query, Result> {
  handle(query: Query): Promise<Result>;
}
