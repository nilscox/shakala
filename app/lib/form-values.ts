export type FormValues<T> = {
  [K in keyof T]: File | string | null;
};
