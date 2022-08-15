import { Command, CommandHandler, CommandResult } from 'backend-application';
import { ClassType } from 'shared';

export interface CommandBus {
  execute<Result extends CommandResult>(command: Command): Promise<Result>;
}

export class RealCommandBus {
  private handlers = new Map<Command, CommandHandler<Command, CommandResult>>();

  register<C extends Command>(command: ClassType<C>, handler: CommandHandler<C, CommandResult>) {
    this.handlers.set(command, handler);
  }

  async execute<Result extends CommandResult>(command: Command): Promise<Result> {
    const ctor = command.constructor;
    const handler = this.handlers.get(ctor);

    if (!handler) {
      throw new Error('CommandBus: cannot find handler for ' + ctor.name);
    }

    return handler.handle(command) as Promise<Result>;
  }
}
