export const omit = <T extends object, K extends keyof T>(object: T, ...keys: K[]): Omit<T, K> => {
  const result = { ...object };

  for (const key of keys) {
    delete result[key];
  }

  return result;
};
