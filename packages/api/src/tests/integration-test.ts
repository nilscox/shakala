import {
  StubCommandBus,
  StubCryptoAdapter,
  StubEventPublisher,
  StubGeneratorAdapter,
  TOKENS,
} from '@shakala/common';

import { container } from '../container';
import { API_TOKENS } from '../tokens';

import { TestServer } from './test-server';

export abstract class IntegrationTest {
  public readonly generator = new StubGeneratorAdapter();
  public readonly crypto = new StubCryptoAdapter();
  public readonly publisher = new StubEventPublisher();
  public readonly commandBus = new StubCommandBus();

  constructor() {
    container.capture?.();

    container.bind(TOKENS.generator).toConstant(this.generator);
    container.bind(TOKENS.crypto).toConstant(this.crypto);
    container.bind(TOKENS.publisher).toConstant(this.publisher);
    container.bind(TOKENS.commandBus).toConstant(this.commandBus);

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
}
