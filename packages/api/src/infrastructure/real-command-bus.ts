import assert from 'assert';

import { Command, CommandBus, CommandHandler } from '@shakala/common';
import { injected } from 'brandi';

export class RealCommandBus implements CommandBus {
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

injected(RealCommandBus);
