import { DeepPartial } from '../types/deep-partial';

import { get } from './get';

export const merge = <T extends object>(left: T, right: DeepPartial<T>): T => {
  if (typeof left !== 'object') {
    return (right as T) ?? left;
  }

  return Object.entries(left).reduce(
    (obj, [key, value]) => ({ ...obj, [key]: merge(value, get(right, key)) }),
    {} as T
  );
};
