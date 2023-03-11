import { TOKENS } from '@shakala/common';

import { container } from '../container';
import { Application } from '../infrastructure/application';
import { API_TOKENS } from '../tokens';

import { MailDevAdapter } from './maildev.adapter';
import { TestServer } from './test-server';

Error.stackTraceLimit = Infinity;

export interface E2ETest {
  arrange?(): void | Promise<void>;
}

export abstract class E2ETest {
  application = new Application();
  emails = new MailDevAdapter();

  async setup() {
    await this.application.init({
      common: { logger: 'stub', buses: 'local', generator: 'nanoid' },
      email: { emailSender: 'nodemailer' },
      notification: { repositories: 'filesystem' },
      thread: { repositories: 'filesystem' },
      user: { repositories: 'filesystem' },
      api: { server: 'test' },
    });

    await this.arrange?.();
  }

  async cleanup() {
    await this.server.close();
    await this.emails.clear();
  }

  get = container.get.bind(container);

  get server() {
    return this.get(API_TOKENS.server) as TestServer;
  }

  get commandBus() {
    return this.get(TOKENS.commandBus);
  }

  get queryBus() {
    return this.get(TOKENS.queryBus);
  }
}
