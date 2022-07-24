type ClassType<T> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): T;
};

export function tryCatch<T>(cb: () => T | Promise<T>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const catchers: Array<[ClassType<Error>, (error: any) => any]> = [];

  return {
    catch<E extends Error, R>(error: ClassType<E>, handler: (error: E) => R) {
      catchers.push([error, handler]);

      return this;
    },
    async run() {
      try {
        return await cb();
      } catch (error) {
        for (const [ErrorClass, handler] of catchers) {
          if (error instanceof ErrorClass) {
            throw handler(error);
          }
        }

        throw error;
      }
    },
  };
}
