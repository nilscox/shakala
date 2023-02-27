export type Factory<T, P = Partial<T>> = (overrides?: P) => T;

/* a function to create another function to create fake data */
export const createFactory = <T>(getDefaults: () => T): Factory<T> => {
  return (overrides) => ({ ...getDefaults(), ...overrides });
};
