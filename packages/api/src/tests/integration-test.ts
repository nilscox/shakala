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
  public readonly application = new Application({
    common: { logger: 'stub', buses: 'stub', generator: 'stub' },
    email: { emailCompiler: 'fake', emailSender: 'stub' },
    notification: { repositories: 'filesystem' },
    thread: { repositories: 'filesystem' },
    user: { repositories: 'filesystem' },
    api: { server: 'test' },
  });

  async setup() {
    container.capture?.();

    await this.application.init();

    await this.arrange?.();
  }

  async cleanup() {
    await this.server.close();
    container.restore?.();
  }

  get = container.get.bind(container);

  get commandBus() {
    return this.get(TOKENS.commandBus) as StubCommandBus;
  }

  get queryBus() {
    return this.get(TOKENS.queryBus) as StubQueryBus;
  }

  get generator() {
    return this.get(TOKENS.generator) as StubGeneratorAdapter;
  }

  get server() {
    return this.get(API_TOKENS.server) as TestServer;
  }

  createAgent() {
    return this.server.agent();
  }

  as(userId: string) {
    return this.server.as(userId);
  }

  set user(user: { id: string; email?: string; nick?: string }) {
    this.queryBus.on(getUser({ id: user.id })).return({ email: '', nick: '', emailValidated: true, ...user });
  }
}
