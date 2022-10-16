import { mockFn } from 'shared';
import { SinonSpy } from 'sinon';

import { CommandBus } from '../infrastructure';

export class MockCommandBus implements CommandBus {
  constructor() {
    beforeEach(() => {
      this.execute = mockFn();
    });
  }

  execute!: SinonSpy;
}
