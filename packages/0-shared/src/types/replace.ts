export type Replace<T, W> = Omit<T, keyof W> & W;
