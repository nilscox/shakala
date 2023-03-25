import { ClassType, DeepPartial, randomId, ReactionType } from '@shakala/shared';
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest';

import { createOrm, EM, Orm } from './create-orm';
import { SqlComment, SqlMessage, SqlReaction, SqlThread, SqlUser } from './entities';

export const createRepositoryTest = <Test extends RepositoryTest>(TestClass: ClassType<Test>) => {
  let orm: Orm;
  let test: Test;

  beforeAll(async () => {
    orm = await createOrm({
      dbName: 'tests',
      allowGlobalContext: true,
    });

    test = new TestClass(orm);
    await test.configureOrm();
  });

  beforeEach(async () => {
    await test.resetDatabase();
    await test?.arrange?.();
  });

  afterEach(async () => {
    await test?.cleanup?.();
  });

  afterAll(async () => {
    await orm?.close(true);
  });

  return () => test;
};

export interface RepositoryTest {
  arrange?(): Promise<void>;
  cleanup?(): Promise<void>;
}

export class RepositoryTest {
  constructor(protected readonly orm: Orm) {}

  get em() {
    return this.orm.em.fork();
  }

  get create() {
    return new SqlFactories(this.em);
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
