// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Query {}

export interface QueryHandler<Query, Result> {
  handle(query: Query): Result | Promise<Result>;
}
