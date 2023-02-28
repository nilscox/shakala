import { Command } from '../../cqs/command';

export interface CommandBus {
  execute(command: Command<unknown>): Promise<void>;
}
