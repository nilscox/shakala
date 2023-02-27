export const getIds = (items: Array<{ id: string }>): string[] => {
  return items.map(({ id }) => id);
};
