export interface Stub<Result, Params extends unknown[]> {
  (...params: Params): Result;

  calls: Array<Params>;
  lastCall: Params | undefined;

  implementation: (...params: Params) => Result;
  implement(implementation: () => Result): void;

  return(result: Result): void;
  resolve(result: Awaited<Result>, delay?: number): void;

  throw(error: unknown): void;
  reject(error: unknown, delay?: number): void;
}

const resolve = <T>(value: T, delay = 0): Promise<T> => {
  if (delay === undefined) {
    return Promise.resolve(value);
  }

  return new Promise((resolve) => {
    setTimeout(() => resolve(value), delay);
  });
};

const reject = (value: unknown, delay = 0): Promise<never> => {
  if (delay === undefined) {
    return Promise.reject(value);
  }

  return new Promise((resolve, reject) => {
    setTimeout(() => reject(value), delay);
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createStubFunction = <F extends (...args: any[]) => any>() => {
  type Result = ReturnType<F>;
  type Params = Parameters<F>;

  const stub: Stub<Result, Params> = (...params) => {
    stub.calls.push(params);
    stub.lastCall = params;

    return stub.implementation(...params);
  };

  stub.calls = [];
  stub.lastCall = undefined;

  stub.implementation = () => {
    throw new Error('not implemented');
  };

  stub.implement = (implementation) => {
    stub.implementation = implementation;
  };

  stub.return = (result) => {
    stub.implement(() => result);
  };

  stub.resolve = (result, delay) => {
    stub.implement(() => resolve(result, delay) as Result);
  };

  stub.throw = (error) => {
    stub.implement(() => {
      throw error;
    });
  };

  stub.reject = (error, delay) => {
    stub.implement(() => reject(error, delay) as never);
  };

  return stub;
};
