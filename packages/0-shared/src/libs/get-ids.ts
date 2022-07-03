export const getIds = <T extends { id: string }>(items: T[]): string[] => {
  return items.map(({ id }) => id);
};
