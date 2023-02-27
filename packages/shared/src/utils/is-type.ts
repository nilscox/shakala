type PrimitiveType = {
  string: string;
  number: number;
  bigint: bigint;
  boolean: boolean;
  symbol: symbol;
  undefined: undefined;
  object: object;
  // eslint-disable-next-line @typescript-eslint/ban-types
  function: Function;
};

export const isType = <T extends keyof PrimitiveType>(
  type: T,
  value: unknown,
): PrimitiveType[T] | undefined => {
  if (typeof value === type) {
    return value as PrimitiveType[T];
  }

  return undefined;
};

export const isString = (value: unknown) => {
  return isType('string', value);
};

export const isArray = <T>(value: T): T[] | undefined => {
  if (typeof value === 'object' && Array.isArray(value)) {
    return value;
  }

  return undefined;
};
