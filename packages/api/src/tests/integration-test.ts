import {
  StubCommandBus,
  StubCryptoAdapter,
  StubEventPublisher,
  StubGeneratorAdapter,
  StubLoggerAdapter,
  StubQueryBus,
  TOKENS,
} from '@shakala/common';
import { getUser } from '@shakala/user';

import { container } from '../container';
import { API_TOKENS } from '../tokens';

import { TestServer } from './test-server';

export abstract class IntegrationTest {
  public readonly commandBus = new StubCommandBus();
  public readonly crypto = new StubCryptoAdapter();
  public readonly generator = new StubGeneratorAdapter();
  public readonly publisher = new StubEventPublisher();
  public readonly queryBus = new StubQueryBus();

  constructor() {
    container.capture?.();

    container.bind(TOKENS.logger).toInstance(StubLoggerAdapter).inSingletonScope();

    container.bind(TOKENS.commandBus).toConstant(this.commandBus);
    container.bind(TOKENS.crypto).toConstant(this.crypto);
    container.bind(TOKENS.generator).toConstant(this.generator);
    container.bind(TOKENS.publisher).toConstant(this.publisher);
    container.bind(TOKENS.queryBus).toConstant(this.queryBus);

    container.bind(API_TOKENS.testServer).toInstance(TestServer).inContainerScope();
  }

  cleanup() {
    container.restore?.();
  }

  private get server() {
    return container.get(API_TOKENS.testServer);
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
