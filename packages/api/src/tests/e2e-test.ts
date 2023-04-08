import { module as commonModule, StubConfigAdapter, StubLoggerAdapter, TOKENS } from '@shakala/common';
import { module as emailModule } from '@shakala/email';
import { module as notificationModule } from '@shakala/notification';
import { module as persistenceModule, PERSISTENCE_TOKENS } from '@shakala/persistence';
import { ClassType } from '@shakala/shared';
import { module as threadModule } from '@shakala/thread';
import { module as userModule } from '@shakala/user';
import { afterEach } from 'vitest';

import { module as apiModule } from '../api.module';
import { container } from '../container';
import { Application } from '../infrastructure/application';
import { API_TOKENS } from '../tokens';

import { MailDevAdapter } from './maildev.adapter';
import { TestServer } from './test-server';

const modules = [
  commonModule,
  persistenceModule,
  emailModule,
  notificationModule,
  userModule,
  threadModule,
  apiModule,
];

export const createE2eTest = <T extends E2ETest>(TestClass: ClassType<T>) => {
  let test: T;
  let application: Application;

  const setup = async (): Promise<T> => {
    modules.forEach((module) => module.capture());

    const config = new StubConfigAdapter({
      app: {
        apiBaseUrl: 'http://api.test',
      },
      database: {
        host: 'localhost',
        user: 'postgres',
        database: 'tests',
        allowGlobalContext: true,
      },
      email: {
        host: 'localhost',
        port: 1025,
        from: 'test@shakala.local',
        templatesPath: '../../email-templates',
      },
    });

    commonModule.bind(TOKENS.config).toConstant(config);
    commonModule.bind(TOKENS.logger).toInstance(StubLoggerAdapter).inTransientScope();

    apiModule.bind(API_TOKENS.server).toInstance(TestServer).inSingletonScope();

    application = new Application();

    await application.init();

    test = new TestClass();

    await test?.emails.clear();
    await test?.database.reset();

    await test.init();
    await test.arrange?.();

    return test;
  };

  afterEach(async () => {
    await test?.cleanup?.();
    await test?.server.close();
    await test?.database.close();
    await application.close();

    modules.forEach((module) => module.restore());
  });

  return setup;
};

export interface E2ETest {
  arrange?(): void | Promise<void>;
  cleanup?(): void | Promise<void>;
}

export abstract class E2ETest {
  emails = new MailDevAdapter();

  async init() {
    await this.database.init();
    await this.database.reset();
  }

  get = container.get.bind(container);

  get server() {
    return this.get(API_TOKENS.server) as TestServer;
  }

  get database() {
    return this.get(PERSISTENCE_TOKENS.database);
  }

  get commandBus() {
    return this.get(TOKENS.commandBus);
  }

  get queryBus() {
    return this.get(TOKENS.queryBus);
  }
}
