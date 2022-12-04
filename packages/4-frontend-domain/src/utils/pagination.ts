export type Paginated<T> = {
  items: T[];
  total: number;
};

export const paginated = <T>(items: T[], total = items.length): Paginated<T> => ({
  items,
  total,
});
