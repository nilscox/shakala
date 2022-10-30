import { Selector } from '../store.types';

class SafeSelectorError extends Error {
  public readonly params: unknown[];

  constructor(name: string, ...params: unknown[]) {
    super(`expected ${name} to be defined ${params.join(', ')}`);
    this.params = params;
  }
}

export const safeSelector = <Params extends unknown[], Result>(
  name: string,
  selector: Selector<Params, Result | undefined>,
): Selector<Params, Result> => {
  return (state, ...params) => {
    const result = selector(state, ...params);

    if (result === undefined) {
      throw new SafeSelectorError(name, params);
    }

    return result;
  };
};
