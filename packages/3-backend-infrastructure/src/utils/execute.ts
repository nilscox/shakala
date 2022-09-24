import { Command, CommandResult, ExecutionContext } from 'backend-application';
import { User } from 'backend-domain';
import { ClassType } from 'shared';

import { CommandBus } from '../infrastructure';

class CommandExecutor<Result extends CommandResult> {
  private context = ExecutionContext.unauthenticated;
  private handlers = new Map<ClassType<Error>, (error: Error) => unknown>();

  constructor(private readonly commandBus: CommandBus, private readonly command: Command) {}

  static execute = <Result extends CommandResult = void>(commandBus: CommandBus) => ({
    command(command: Command) {
      return new CommandExecutor<Result>(commandBus, command);
    },
  });

  asUser(user: User | undefined) {
    this.context = new ExecutionContext(user);
    return this;
  }

  handle<E extends Error>(error: ClassType<E>, handler: (error: E) => unknown) {
    this.handlers.set(error, handler as (error: Error) => undefined);
    return this;
  }

  async run(): Promise<Result> {
    try {
      return await this.commandBus.execute<Result>(this.command, this.context);
    } catch (error) {
      if (!(error instanceof Error)) {
        throw error;
      }

      const handler = this.handlers.get(error.constructor as ClassType<Error>);

      if (handler) {
        throw handler(error);
      }

      throw error;
    }
  }
}

export const { execute } = CommandExecutor;
