import { TOKENS } from '@shakala/common';

import { container } from '../container';
import { Application } from '../infrastructure/application';
import { API_TOKENS } from '../tokens';

import { TestServer } from './test-server';

Error.stackTraceLimit = Infinity;

export interface E2ETest {
  arrange?(): void | Promise<void>;
}

export abstract class E2ETest {
  application = new Application();

  async setup() {
    await this.application.init({
      common: { logger: 'stub' },
      email: { emailSender: 'stub' },
      thread: { repositories: 'filesystem' },
      user: { repositories: 'filesystem' },
      api: { server: 'test' },
    });

    await this.arrange?.();
  }

  async cleanup() {
    await this.server.close();
  }

  get server() {
    return container.get(API_TOKENS.server) as TestServer;
  }

  get commandBus() {
    return container.get(TOKENS.commandBus);
  }
}
