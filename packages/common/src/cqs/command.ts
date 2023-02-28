export type Command<T = unknown> = T & {
  __symbol: symbol;
};

export const commandCreator = <T>(symbol: symbol) => {
  return (command: T): Command<T> => ({
    __symbol: symbol,
    ...command,
  });
};
