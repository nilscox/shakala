export type CommandResult = void | string;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Command {}

export interface CommandHandler<Command, Result extends CommandResult = void> {
  handle(command: Command): Result | Promise<Result>;
}
