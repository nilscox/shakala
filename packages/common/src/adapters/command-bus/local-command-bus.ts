import { assert } from '@shakala/shared';
import { Container, injected } from 'brandi';

import { ExecutableCommand } from '../../cqs/command';

import { CommandBus } from './command-bus.port';
import { getCommandHandlerToken } from './register-command';

export class LocalCommandBus implements CommandBus {
  private container?: Container;

  setContainer(container: Container) {
    this.container = container;
  }

  async execute({ symbol, command }: ExecutableCommand<unknown>): Promise<void> {
    assert(this.container);
    await this.container.get(getCommandHandlerToken(symbol)).handle(command);
  }
}

injected(LocalCommandBus);
