import { StubConfigAdapter } from '@shakala/common';
import { ClassType, DeepPartial, randomId, ReactionType } from '@shakala/shared';
import { afterAll, afterEach } from 'vitest';

import { EM } from './create-orm';
import { Database } from './database';
import {
  SqlComment,
  SqlCommentReport,
  SqlCommentSubscription,
  SqlMessage,
  SqlNotification,
  SqlReaction,
  SqlThread,
  SqlUser,
  SqlUserActivity,
} from './entities';

export const createRepositoryTest = <Test extends RepositoryTest>(TestClass: ClassType<Test>) => {
  let test: Test;

  const setup = async () => {
    test = new TestClass();

    await test.init();
    await test.arrange?.();

    return test;
  };

  afterEach(async () => {
    await test?.cleanup?.();
  });

  afterAll(async () => {
    await test.database?.close();
  });

  return setup;
};

export interface RepositoryTest {
  arrange?(): Promise<void>;
  cleanup?(): Promise<void>;
}

export class RepositoryTest {
  config = new StubConfigAdapter({
    database: {
      host: 'localhost',
      user: 'postgres',
      database: 'tests',
      allowGlobalContext: true,
    },
  });

  database = new Database(this.config);

  get em() {
    return this.database.em.fork();
  }

  get create() {
    return new SqlFactories(this.em);
  }

  async init() {
    await this.database.init();
    await this.database.reset();
  }
}

interface SqlFactory<T> {
  (overrides?: DeepPartial<T>): Promise<T>;
  (overrides: Array<DeepPartial<T>>): Promise<T[]>;
}

export class SqlFactories {
  constructor(private em: EM) {}

  private factory<T>(Class: ClassType<T>, defaults: Partial<T>): SqlFactory<T> {
    const create = (overrides?: DeepPartial<T>) => {
      return this.em.create(Class, {
        id: randomId(),
        createdAt: new Date(),
        updatedAt: new Date(),
        ...defaults,
        ...overrides,
      });
    };

    return async (overrides) => {
      const entity = Array.isArray(overrides) ? overrides.map(create) : create(overrides);

      await this.em.persistAndFlush(entity);

      return entity;
    };
  }

  comment = this.factory(SqlComment, {
    parent: null,
  });

  commentReport = this.factory(SqlCommentReport, {
    reason: null,
  });

  user = this.factory(SqlUser, {
    nick: '',
    email: '',
    hashedPassword: '',
    emailValidationToken: null,
    hasWriteAccess: true,
  });

  userActivity = this.factory(SqlUserActivity, {
    type: '',
    payload: null,
  });

  thread = this.factory(SqlThread, {
    description: '',
    keywords: [],
    text: '',
  });

  message = this.factory(SqlMessage, {
    text: '',
  });

  notification = this.factory(SqlNotification, {
    type: '',
    payload: {},
  });

  reaction = this.factory(SqlReaction, {
    type: ReactionType.upvote,
  });

  commentSubscription = this.factory(SqlCommentSubscription, {});
}
