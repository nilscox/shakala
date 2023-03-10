import { StubCommandBus, StubGeneratorAdapter, StubQueryBus, TOKENS } from '@shakala/common';
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

  async setup() {
    container.capture?.();

    await this.application.init({
      common: { logger: 'stub', buses: 'stub', generator: 'stub' },
      email: { emailSender: 'stub' },
      thread: { repositories: 'filesystem' },
      user: { repositories: 'filesystem' },
      api: { server: 'test' },
    });

    await this.arrange?.();
  }

  cleanup() {
    container.restore?.();
  }

  get commandBus() {
    return container.get(TOKENS.commandBus) as StubCommandBus;
  }

  get queryBus() {
    return container.get(TOKENS.queryBus) as StubQueryBus;
  }

  get generator() {
    return container.get(TOKENS.generator) as StubGeneratorAdapter;
  }

  get server() {
    return container.get(API_TOKENS.server) as TestServer;
  }

  createAgent() {
    return this.server.agent();
  }

  as(userId: string) {
    return this.server.as(userId);
  }

  set user(user: { id: string; email?: string; nick?: string }) {
    this.queryBus.on(getUser({ id: user.id })).return({ email: '', nick: '', ...user });
  }
}
