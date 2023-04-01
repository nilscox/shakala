export type Page<T> = {
  items: T[];
  total: number;
};

export const createPage = <T>(items: T[]): Page<T> => ({
  items,
  total: items.length,
});
