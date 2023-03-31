export type DeepExclude<T, V> = {
  [K in keyof T as T[K] extends V ? never : K]: T[K] extends object ? DeepExclude<T[K], V> : T[K];
};
