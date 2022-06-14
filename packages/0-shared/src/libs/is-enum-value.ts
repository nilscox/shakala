type EnumType<T extends string> = {
  [key: string]: T;
};

export const isEnumValue = <T extends string>(enumType: EnumType<T>) => {
  return (value?: string): value is T => {
    return Object.values(enumType).includes(value as T);
  };
};
