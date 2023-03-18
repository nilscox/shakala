export type Methods<T> = {
  [K in keyof T]: T[K] extends (...params: unknown[]) => unknown ? T[K] : never;
};
