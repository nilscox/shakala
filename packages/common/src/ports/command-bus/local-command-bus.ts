import assert from 'assert';

import { injected } from 'brandi';

import { Command } from '../../cqs/command';
import { CommandHandler } from '../../cqs/command-handler';

import { CommandBus } from './command-bus.port';

export class LocalCommandBus implements CommandBus {
  private handlers = new Map<symbol, CommandHandler<unknown>>();

  register(handler: CommandHandler<unknown>) {
    this.handlers.set(handler.symbol, handler);
  }

  async execute({ __symbol, ...command }: Command<unknown>): Promise<void> {
    const handler = this.handlers.get(__symbol);

    assert(handler, `No handler found for command ${String(__symbol)}`);

    await handler.handle(command);
  }
}

injected(LocalCommandBus);
