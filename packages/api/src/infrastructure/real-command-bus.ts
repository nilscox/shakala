import { CommandBus, CommandHandler } from '@shakala/common';

import { Dependencies } from '../dependencies';

export class RealCommandBus implements CommandBus<Dependencies> {
  constructor(private readonly dependencies: Dependencies) {}

  execute<Command>(handler: CommandHandler<Dependencies, Command>, command: Command): Promise<void> {
    return handler(this.dependencies, command);
  }
}
