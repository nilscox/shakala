export const createMap = <K extends string, V>(keys: K[], getValue: (key: K) => V): Record<K, V> => {
  return keys.reduce(
    (obj, key) => ({
      ...obj,
      [key]: getValue(key),
    }),
    {} as Record<K, V>,
  );
};
