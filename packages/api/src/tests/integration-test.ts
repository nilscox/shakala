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

  get server() {
    return container.get(API_TOKENS.testServer);
  }

  get agent() {
    return this.server.agent;
  }

  get as() {
    return this.server.as.bind(this.server);
  }

  set user(user: { id: string; email?: string }) {
    this.queryBus.register(getUser({ id: user.id }), { email: '', ...user });
  }
}
