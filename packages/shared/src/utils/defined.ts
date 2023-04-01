import { assert } from './assert';

export const defined = <T>(value: T, message?: string): NonNullable<T> => {
  assert(value, message);
  return value;
};
