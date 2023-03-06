import { Container, injected } from 'brandi';

import { ExecutableCommand } from '../../cqs/command';
import { TOKENS } from '../../tokens';

import { CommandBus } from './command-bus.port';
import { getCommandHandlerToken } from './register-command';

export class LocalCommandBus implements CommandBus {
  constructor(private readonly container: Container) {}

  async execute({ symbol, command }: ExecutableCommand<unknown>): Promise<void> {
    await this.container.get(getCommandHandlerToken(symbol)).handle(command);
  }
}

injected(LocalCommandBus, TOKENS.container);
