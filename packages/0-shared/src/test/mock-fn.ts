import { fake, SinonSpy, spy } from 'sinon';

/* eslint-disable @typescript-eslint/no-explicit-any */

export function mockFn(): SinonSpy<any, void>;
export function mockFn<F extends (...args: any[]) => any>(
  value?: ReturnType<F>,
): SinonSpy<any, ReturnType<F>>;

export function mockFn<T>(returnValue?: T) {
  return fake.returns(returnValue);
}

const defaultImpl = (): any => {
  throw new Error('mockImpl(): not implemented');
};

export function mockImpl<Impl extends (...args: any[]) => any>(impl?: Impl) {
  return spy<Impl>(impl ?? (defaultImpl as Impl));
}

export function mockResolve(): SinonSpy<any, Promise<void>>;
export function mockResolve<T>(value: T): SinonSpy<any, Promise<T>>;

export function mockResolve<T>(value?: T) {
  return fake.resolves(value);
}

export function mockReject(value?: unknown) {
  return fake.rejects<any, any>(value);
}
