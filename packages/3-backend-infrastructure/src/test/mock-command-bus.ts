import { mockFn } from 'shared/test';
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
