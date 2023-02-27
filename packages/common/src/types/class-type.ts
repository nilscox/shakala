// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ClassType<T, CtorParameters extends any[] = any[]> = {
  new (...params: CtorParameters): T;
};
