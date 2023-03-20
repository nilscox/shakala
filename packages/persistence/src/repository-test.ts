import { ClassType, DeepPartial, randomId } from '@shakala/shared';

import { createOrm, EM, Orm } from './create-orm';
import { SqlUser, SqlThread, SqlComment, SqlMessage } from './entities';

export interface RepositoryTest {
  arrange?(): Promise<void>;
}

export class RepositoryTest {
  protected orm!: Orm;

  get em() {
    return this.orm.em.fork();
  }

  get create() {
    return new SqlFactories(this.em);
  }

  async setup() {
    this.orm = await createOrm({
      dbName: 'tests',
      allowGlobalContext: true,
    });

    await this.configureOrm();
    await this.resetDatabase();

    await this.arrange?.();
  }

  async cleanup() {
    await this.orm?.close(true);
  }

  private async configureOrm() {
    this.orm.config.getLogger().setDebugMode(false);
  }

  private async resetDatabase() {
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
}
