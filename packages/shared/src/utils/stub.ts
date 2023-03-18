/* eslint-disable @typescript-eslint/no-unsafe-return */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: any[]) => any;

export interface Stub<Result, Params extends unknown[]> {
  (...params: Params): Result;

  delay?: number;

  calls: Array<Params>;
  lastCall: Params | undefined;

  implementation: (...params: Params) => Result;
  implement(implementation: (...params: Params) => Result): this;

  return(result: Result): this;
  resolve(result: Awaited<Result>): this;

  throw(error: unknown): this;
  reject(error: unknown): this;
}

export type StubOf<Func extends AnyFunction> = Stub<ReturnType<Func>, Parameters<Func>>;

export const stub = <F extends AnyFunction>(implementation?: F) => {
  type Result = ReturnType<F>;
  type Params = Parameters<F>;

  const stub: Stub<Result, Params> = (...params) => {
    stub.calls.push(params);
    stub.lastCall = params;

    return stub.implementation(...params);
  };

  stub.calls = [];
  stub.lastCall = undefined;

  stub.implementation = implementation ?? ((() => undefined) as F);

  stub.implement = (implementation) => {
    stub.implementation = implementation;
    return stub;
  };

  stub.return = (result) => {
    stub.implement(() => result);
    return stub;
  };

  stub.resolve = (result) => {
    stub.implement(() => Promise.resolve(result) as Result);
    return stub;
  };

  stub.throw = (error) => {
    stub.implement(() => {
      throw error;
    });
    return stub;
  };

  stub.reject = (error) => {
    stub.implement(() => Promise.reject(error) as never);
    return stub;
  };

  return stub;
};
