export type EnumType<T extends string> = {
  [key: string]: T;
};
