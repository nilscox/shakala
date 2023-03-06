export const commandCreator = <T>(name?: string): CommandCreator<T> => {
  const symbol = Symbol(name);
  const createCommand = (command: T) => ({
    symbol,
    command,
  });

  createCommand.symbol = symbol;

  return createCommand;
};

export interface CommandCreator<T> {
  (command: T): ExecutableCommand<T>;
  symbol: symbol;
}

export type ExecutableCommand<T> = {
  symbol: symbol;
  command: T;
};
