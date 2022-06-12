export const mockFn = <F extends (...args: any) => any>() => {
  return vi.fn<Parameters<F>, ReturnType<F>>();
};
