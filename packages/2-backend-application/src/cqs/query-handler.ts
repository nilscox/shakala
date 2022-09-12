// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Query {}

export interface QueryHandler<Query, Result> {
  init?(): void | Promise<void>;
  handle(query: Query): Result | Promise<Result>;
}
