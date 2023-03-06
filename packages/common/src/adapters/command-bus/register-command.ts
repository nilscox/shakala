import assert from 'assert';

import { Token } from 'brandi';

import { CommandCreator } from '../../cqs/command';
import { CommandHandler } from '../../cqs/command-handler';

const commandHandlers: Record<symbol, Token<CommandHandler<unknown>>> = {};

export const registerCommand = <Command>(
  creator: CommandCreator<Command>,
  token: Token<CommandHandler<Command>>
) => {
  const symbol = creator.symbol;

  assert(!commandHandlers[symbol], `Handler already registered for command ${String(symbol)}`);

  commandHandlers[symbol] = token;
};

export const getCommandHandlerToken = (symbol: symbol) => {
  const handler = commandHandlers[symbol];

  assert(handler, `No handler found for command ${String(symbol)}`);

  return handler;
};
