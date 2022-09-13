import { Authorizer, Command, CommandHandler, CommandResult, ExecutionContext } from 'backend-application';
import { ClassType } from 'shared';

export interface CommandBus {
  execute<Result extends CommandResult>(command: Command, ctx: ExecutionContext): Promise<Result>;
}

// cspell:word authorizable
interface AuthorizableCommandHandler<C extends Command, R extends CommandResult>
  extends CommandHandler<C, R> {
  authorizers?: Authorizer[];
}

export class RealCommandBus implements CommandBus {
  private handlers = new Map<Command, AuthorizableCommandHandler<Command, CommandResult>>();

  register<C extends Command>(command: ClassType<C>, handler: CommandHandler<C, CommandResult>) {
    this.handlers.set(command, handler);
  }

  async init(): Promise<void> {
    for (const handler of this.handlers.values()) {
      const ctor = handler.constructor;
      const Authorizers: Array<ClassType<Authorizer>> | undefined = Reflect.get(ctor, 'authorizers');

      if (Authorizers) {
        handler.authorizers = Authorizers.map((Authorizer) => new Authorizer());
      }

      await handler.init?.();
    }
  }

  async execute<Result extends CommandResult>(command: Command, ctx: ExecutionContext): Promise<Result> {
    const ctor = command.constructor;
    const handler = this.handlers.get(ctor);

    if (!handler) {
      throw new Error('CommandBus: cannot find handler for ' + ctor.name);
    }

    if (handler.authorizers) {
      await Promise.all(handler.authorizers.map((authorizer) => authorizer.authorize(ctx)));
    }

    return handler.handle(command, ctx) as Promise<Result>;
  }
}
