export interface CommandHandler<Command> {
  handle(command: Command): Promise<void>;
}
