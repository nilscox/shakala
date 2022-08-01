/* a function to create another function to create fake data */
export const createFactory = <T>(getDefaults: () => T) => {
  return (overrides?: Partial<T>) => ({ ...getDefaults(), ...overrides });
};
