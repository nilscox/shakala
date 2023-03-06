import { ExecutableCommand } from '../../cqs/command';

export interface CommandBus {
  execute(command: ExecutableCommand<unknown>): Promise<void>;
}
