export const groupBy = <T, K extends keyof T>(array: T[], key: K): Map<T[K], T[]> => {
  const map = new Map<T[K], T[]>();

  for (const element of array) {
    if (map.has(element[key])) {
      continue;
    }

    map.set(
      element[key],
      array.filter((e) => e[key] === element[key]),
    );
  }

  return map;
};
