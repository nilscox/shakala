import { ExecutionContext } from '../utils';

export type CommandResult = void | string;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Command {}

export interface CommandHandler<Command, Result extends CommandResult = void> {
  init?(): void | Promise<void>;
  handle(command: Command, ctx: ExecutionContext): Result | Promise<Result>;
}
