import { ClassType, DeepPartial, randomId, ReactionType } from '@shakala/shared';
import { afterEach } from 'vitest';

import { createOrm, EM, Orm } from './create-orm';
import { Database } from './database';
import { SqlComment, SqlMessage, SqlReaction, SqlThread, SqlUser, SqlUserActivity } from './entities';

export const createRepositoryTest = <Test extends RepositoryTest>(TestClass: ClassType<Test>) => {
  let orm: Orm;
  let test: Test;

  afterEach(async () => {
    await test?.cleanup?.();
    await orm?.close(true);
  });

  return async () => {
    orm = await createOrm({
      dbName: 'tests',
      allowGlobalContext: true,
    });

    test = new TestClass(orm);

    await test.init();
    await test.arrange?.();

    return test;
  };
};

export interface RepositoryTest {
  arrange?(): Promise<void>;
  cleanup?(): Promise<void>;
}

export class RepositoryTest {
  database = new Database(async () => this.orm);

  constructor(protected readonly orm: Orm) {}

  get em() {
    return this.orm.em.fork();
  }

  get create() {
    return new SqlFactories(this.em);
  }

  async init() {
    await this.database.init();
    await this.configureOrm();
    await this.resetDatabase();
  }

  async configureOrm() {
    this.orm.config.getLogger().setDebugMode(false);
  }

  async resetDatabase() {
    const schemaGenerator = this.orm.getSchemaGenerator();

    await schemaGenerator.refreshDatabase();
    await schemaGenerator.clearDatabase();
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

  user = this.factory(SqlUser, {
    nick: '',
    email: '',
    hashedPassword: '',
    emailValidationToken: null,
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

  comment = this.factory(SqlComment, {
    parent: null,
  });

  message = this.factory(SqlMessage, {
    text: '',
  });

  reaction = this.factory(SqlReaction, {
    type: ReactionType.upvote,
  });
}
