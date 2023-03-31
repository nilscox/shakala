import { DeepExclude } from '../types/deep-exclude';

export const removeUndefinedValues = <T>(obj: T): DeepExclude<T, undefined> => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(removeUndefinedValues) as T;
  }

  return Object.entries(obj).reduce((obj, [key, value]) => {
    if (typeof value === 'undefined') {
      return obj;
    }

    return { ...obj, [key]: removeUndefinedValues(value) };
  }, {} as T);
};
