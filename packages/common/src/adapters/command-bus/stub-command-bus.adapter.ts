import { CommandCreator, ExecutableCommand } from '../../cqs/command';

import { CommandBus } from './command-bus.port';

export class StubCommandBus extends Array<unknown> implements CommandBus {
  private readonly errors = new Map<symbol, Error>();

  on<T>(creator: CommandCreator<T>) {
    return {
      throw: (error: Error) => {
        this.errors.set(creator.symbol, error);
      },
    };
  }

  async execute(command: ExecutableCommand<unknown>): Promise<void> {
    this.push(command);

    const error = this.errors.get(command.symbol);

    if (error) {
      throw error;
    }
  }
}
