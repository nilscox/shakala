import {
  StubCommandBus,
  StubCryptoAdapter,
  StubEventPublisher,
  StubGeneratorAdapter,
  StubQueryBus,
  TOKENS,
} from '@shakala/common';
import { getUser } from '@shakala/user';

import { container } from '../container';
import { Application } from '../infrastructure/application';
import { API_TOKENS } from '../tokens';

import { TestServer } from './test-server';

Error.stackTraceLimit = Infinity;

export interface IntegrationTest {
  arrange?(): void | Promise<void>;
}

export abstract class IntegrationTest {
  public readonly application = new Application();

  public readonly commandBus = new StubCommandBus();
  public readonly crypto = new StubCryptoAdapter();
  public readonly generator = new StubGeneratorAdapter();
  public readonly publisher = new StubEventPublisher();
  public readonly queryBus = new StubQueryBus();

  async setup() {
    container.capture?.();

    await this.application.init({
      common: { logger: 'stub' },
      email: { emailSender: 'stub' },
      thread: { repositories: 'filesystem' },
      user: { repositories: 'filesystem' },
      api: { server: 'test' },
    });

    container.bind(TOKENS.commandBus).toConstant(this.commandBus);
    container.bind(TOKENS.crypto).toConstant(this.crypto);
    container.bind(TOKENS.generator).toConstant(this.generator);
    container.bind(TOKENS.publisher).toConstant(this.publisher);
    container.bind(TOKENS.queryBus).toConstant(this.queryBus);

    await this.arrange?.();
  }

  cleanup() {
    container.restore?.();
  }

  private get server() {
    return container.get(API_TOKENS.server) as TestServer;
  }

  createAgent() {
    return this.server.agent();
  }

  as(userId: string) {
    return this.server.as(userId);
  }

  set user(user: { id: string; email?: string }) {
    this.queryBus.register(getUser({ id: user.id }), { email: '', ...user });
  }
}
