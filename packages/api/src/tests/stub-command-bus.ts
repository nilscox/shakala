import { CommandBus, CommandHandler } from '@shakala/common';

import { Dependencies } from '../dependencies';

export class StubCommandBus implements CommandBus<Dependencies> {
  // eslint-disable-next-line @typescript-eslint/ban-types
  private handlers = new Map<Function, Function>();

  set<Command>(handler: CommandHandler<Dependencies, Command>, impl: CommandHandler<Dependencies, Command>) {
    this.handlers.set(handler, impl);
  }

  clear() {
    this.handlers.clear();
  }

  async execute<Command>(handler: CommandHandler<Dependencies, Command>, command: Command): Promise<void> {
    const handlerImpl = this.handlers.get(handler);

    if (!handlerImpl) {
      throw new Error(`StubCommandBus: no implementation for handler ${String(handler.name)}`);
    }

    await handlerImpl(command);
  }
}
