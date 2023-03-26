import { StubCommandBus, StubGeneratorAdapter, StubQueryBus, TOKENS } from '@shakala/common';
import { ClassType } from '@shakala/shared';
import { getUser } from '@shakala/user';
import { afterEach } from 'vitest';

import { container } from '../container';
import { Application } from '../infrastructure/application';
import { API_TOKENS } from '../tokens';

import { FetchAgent } from './fetch-agent';
import { TestServer } from './test-server';

Error.stackTraceLimit = Infinity;

export const createControllerTest = <Test extends ControllerTest>(TestClass: ClassType<Test>) => {
  let application: Application;
  let test: Test;

  afterEach(async () => {
    await application?.close();
    await test?.server.close();
    await test?.cleanup?.();
  });

  return async () => {
    application = new Application({
      common: { logger: 'stub', buses: 'stub', generator: 'stub' },
      email: { emailCompiler: 'fake', emailSender: 'stub' },
      notification: { repositories: 'memory' },
      persistence: { useDatabase: false },
      thread: { repositories: 'memory' },
      user: { repositories: 'memory', profileImage: 'stub' },
      api: { server: 'test' },
    });

    await application.init();

    test = new TestClass();

    await test.server.listen();
    await test.arrange?.();

    return test;
  };
};

export interface ControllerTest {
  arrange?(): void | Promise<void>;
  cleanup?(): void | Promise<void>;
}

export abstract class ControllerTest {
  constructor() {
    container.bind(TOKENS.queryBus).toInstance(StubQueryBus).inContainerScope();
    container.bind(TOKENS.commandBus).toInstance(StubCommandBus).inContainerScope();
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

  get = container.get.bind(container);

  get server() {
    return this.get(API_TOKENS.server) as TestServer;
  }

  get queryBus() {
    return container.get(TOKENS.queryBus) as StubQueryBus;
  }

  get commandBus() {
    return container.get(TOKENS.commandBus) as StubCommandBus;
  }

  get generator() {
    return container.get(TOKENS.generator) as StubGeneratorAdapter;
  }
}
