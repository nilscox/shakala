import { Command } from '../../cqs/command';

import { CommandBus } from './command-bus.port';

export class StubCommandBus extends Array<Command> implements CommandBus {
  readonly executed = new Array<Command>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private handlers = new Map<symbol, (command: any) => Promise<void>>();

  register<C>(creator: (command: C) => Command<C>, impl: (command: C) => Promise<void>) {
    this.handlers.set(creator({} as C).__symbol, impl);
  }

  async execute(command: Command): Promise<void> {
    this.push(command);
    await this.handlers.get(command.__symbol)?.(command);
  }
}
