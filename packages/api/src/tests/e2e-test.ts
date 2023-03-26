import { TOKENS } from '@shakala/common';
import { PERSISTENCE_TOKENS } from '@shakala/persistence';
import { ClassType } from '@shakala/shared';
import { afterEach } from 'vitest';

import { container } from '../container';
import { Application } from '../infrastructure/application';
import { API_TOKENS } from '../tokens';

import { MailDevAdapter } from './maildev.adapter';
import { TestServer } from './test-server';

Error.stackTraceLimit = Infinity;

export const createE2eTest = <T extends E2ETest>(TestClass: ClassType<T>) => {
  let test: T;
  let application: Application;

  afterEach(async () => {
    await test?.cleanup?.();
    await test?.server.close();
    await test?.emails.clear();
    await application.close();
  });

  return async (): Promise<T> => {
    application = new Application({
      common: { logger: 'stub', buses: 'local', generator: 'nanoid' },
      email: { emailCompiler: 'mjml', emailSender: 'nodemailer' },
      notification: { repositories: 'filesystem' },
      persistence: { useDatabase: true, allowGlobalContext: true, dbName: 'tests' },
      thread: { repositories: 'sql' },
      user: { repositories: 'sql', profileImage: 'gravatar' },
      api: { server: 'test' },
    });

    await container.get(PERSISTENCE_TOKENS.database).reset();
    await application.init();

    test = new TestClass();

    await test.arrange?.();

    return test;
  };
};

export interface E2ETest {
  arrange?(): void | Promise<void>;
  cleanup?(): void | Promise<void>;
}

export abstract class E2ETest {
  emails = new MailDevAdapter();

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
