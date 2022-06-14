// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mockFn = <F extends (...args: any) => any>() => {
  return vi.fn<Parameters<F>, ReturnType<F>>();
};
