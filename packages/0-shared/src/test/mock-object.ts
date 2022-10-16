import { fake, SinonSpy } from 'sinon';

export type MockedObject<T> = {
  [Key in keyof T]: T[Key] extends (...args: infer A) => infer R ? SinonSpy<A, R> : T[Key];
};

export const mockObject = <T extends object>(obj: Partial<T>): MockedObject<T> => {
  return Object.entries(obj).reduce(
    (obj, [key, value]) => ({
      ...obj,
      [key]: typeof value === 'function' ? fake() : value,
    }),
    {} as MockedObject<T>,
  );
};
