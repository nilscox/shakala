export const get = (object: unknown, ...path: string[]): unknown => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = object;

  for (const key of path) {
    if (!current) {
      return;
    }

    current = current[key];
  }

  return current;
};
