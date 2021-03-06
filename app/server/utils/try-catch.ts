type ClassType<T> = {
  new (...args: any[]): T;
};

export function tryCatch<T>(cb: () => T | Promise<T>) {
  const catchers: Array<[ClassType<Error>, (error: any) => any]> = [];

  return {
    catch<E extends Error, R>(error: ClassType<E>, handler: (error: E) => R) {
      catchers.push([error, handler]);

      return this;
    },
    async value() {
      try {
        return await cb();
      } catch (error) {
        for (const [ErrorClass, handler] of catchers) {
          if (error instanceof ErrorClass) {
            return handler(error);
          }
        }

        throw error;
      }
    },
  };
}
