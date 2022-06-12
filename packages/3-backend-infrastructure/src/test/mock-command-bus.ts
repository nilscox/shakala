import { CommandBus } from '../infrastructure';

export class MockCommandBus implements CommandBus {
  execute = vi.fn();
}
