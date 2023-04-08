import {
  module as commonModule,
  StubCommandBus,
  StubConfigAdapter,
  StubGeneratorAdapter,
  StubLoggerAdapter,
  StubQueryBus,
  TOKENS,
} from '@shakala/common';
import { module as emailModule } from '@shakala/email';
import { module as notificationModule } from '@shakala/notification';
import { module as persistenceModule } from '@shakala/persistence';
import { ClassType } from '@shakala/shared';
import { module as threadModule } from '@shakala/thread';
import { module as userModule, getUser } from '@shakala/user';
import { afterEach } from 'vitest';

import { module as apiModule } from '../api.module';
import { container } from '../container';
import { Application } from '../infrastructure/application';
import { API_TOKENS } from '../tokens';

import { FetchAgent } from './fetch-agent';
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

export const createControllerTest = <Test extends ControllerTest>(TestClass: ClassType<Test>) => {
  let application: Application;
  let test: Test;

  const setup = async () => {
    modules.forEach((module) => module.capture());

    const config = new StubConfigAdapter({
      app: {
        host: 'localhost',
        port: 0,
      },
    });

    commonModule.bind(TOKENS.config).toConstant(config);
    commonModule.bind(TOKENS.logger).toInstance(StubLoggerAdapter).inTransientScope();

    apiModule.bind(API_TOKENS.server).toInstance(TestServer).inSingletonScope();

    persistenceModule.bypass();
    emailModule.stub();

    application = new Application();

    await application.init();

    test = new TestClass();

    await test.server.listen();
    await test.arrange?.();

    return test;
  };

  afterEach(async () => {
    await application?.close();
    await test?.cleanup?.();

    modules.forEach((module) => module.restore());
  });

  return setup;
};

export interface ControllerTest {
  arrange?(): void | Promise<void>;
  cleanup?(): void | Promise<void>;
}

export abstract class ControllerTest {
  public readonly queryBus = new StubQueryBus();
  public readonly commandBus = new StubCommandBus();
  public readonly generator = new StubGeneratorAdapter();

  get server() {
    return container.get(API_TOKENS.server) as TestServer;
  }

  constructor() {
    commonModule.bind(TOKENS.queryBus).toConstant(this.queryBus);
    commonModule.bind(TOKENS.commandBus).toConstant(this.commandBus);
    commonModule.bind(TOKENS.generator).toConstant(this.generator);
  }

  createAgent() {
    return this.server.agent();
  }

  as(userId: string): FetchAgent {
    return this.server.as(userId);
  }

  createUser(user: { id: string; email?: string; nick?: string }) {
    this.queryBus.on(getUser({ id: user.id })).return({ email: '', nick: '', emailValidated: true, ...user });
  }
}
