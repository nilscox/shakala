import expect from '@nilscox/expect';
import {
  module as commonModule,
  StubConfigAdapter,
  StubEventPublisher,
  StubLoggerAdapter,
  TOKENS,
} from '@shakala/common';
import { module as emailModule } from '@shakala/email';
import { module as persistenceModule } from '@shakala/persistence';
import { afterEach, beforeEach, describe, it } from 'vitest';

import { module as apiModule } from '../api.module';
import { container } from '../container';
import { TestServer } from '../tests/test-server';
import { API_TOKENS } from '../tokens';

import { Application } from './application';

describe('[intg] Server', () => {
  let application: Application;

  beforeEach(async () => {
    const config = new StubConfigAdapter({
      app: { host: 'localhost', port: 4242 },
    });

    commonModule.bind(TOKENS.config).toConstant(config);

    commonModule.bind(TOKENS.logger).toInstance(StubLoggerAdapter).inTransientScope();
    commonModule.bind(TOKENS.publisher).toInstance(StubEventPublisher).inSingletonScope();

    apiModule.bind(API_TOKENS.server).toInstance(TestServer).inSingletonScope();

    emailModule.stub();
    persistenceModule.bypass();

    application = new Application();
    await application.init();
  });

  afterEach(async () => {
    await application?.close();
  });

  it('starts an HTTP server on a given host and port', async () => {
    const server = container.get(API_TOKENS.server);

    await server.listen();
    await expect(fetch('http://localhost:4242')).toResolve();

    await server.close();
    await expect(fetch('http://localhost:4242')).toReject();
  });
});
