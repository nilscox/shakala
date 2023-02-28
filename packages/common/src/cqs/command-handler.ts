export interface CommandHandler<Command> {
  symbol: symbol;
  handle(command: Command): Promise<void>;
}
