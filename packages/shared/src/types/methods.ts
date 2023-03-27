import { AnyFunction } from './any-function';

export type Methods<T> = {
  [K in keyof T as T[K] extends AnyFunction ? K : never]: T[K];
};
