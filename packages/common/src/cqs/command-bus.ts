import { CommandHandler } from './command-handler';

export interface CommandBus<Deps> {
  execute<Command>(handler: CommandHandler<Deps, Command>, command: Command): Promise<void>;
}
