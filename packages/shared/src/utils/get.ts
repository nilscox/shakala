export const get = (object: unknown, ...path: string[]): unknown => {
  let current = object;

  for (const key of path) {
    if (!current) {
      return;
    }

    current = current[key as keyof typeof current];
  }

  return current;
};
