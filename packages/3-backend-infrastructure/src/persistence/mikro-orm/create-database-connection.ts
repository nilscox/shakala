import { MikroORM, Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

import { createDatabaseSaver } from '../utils/save-test-data';

import config from './mikro-orm.config';

export const createDatabaseConnection = async (override: Options<PostgreSqlDriver> = {}) => {
  return MikroORM.init<PostgreSqlDriver>({ ...config, ...override });
};

export const createTestDatabaseConnection = async (options: Options<PostgreSqlDriver> = {}) => {
  const orm = await createDatabaseConnection(options);
  const schemaGenerator = orm.getSchemaGenerator();

  await schemaGenerator.ensureDatabase();
  await schemaGenerator.refreshDatabase();

  return orm;
};

export const resetDatabase = async (orm: MikroORM) => {
  const schemaGenerator = orm.getSchemaGenerator();

  await schemaGenerator.clearDatabase();
};

export const setupTestDatabase = (override: Options<PostgreSqlDriver> = {}) => {
  let orm: MikroORM<PostgreSqlDriver>;
  let isReady = false;

  beforeAll(async () => {
    orm = await createTestDatabaseConnection({ dbName: 'intg', ...override });
  });

  afterAll(async () => {
    await orm.close();
  });

  beforeEach(async () => {
    isReady = false;
    await resetDatabase(orm);
    isReady = true;
  });

  const getEntityManager = () => orm.em.fork();

  const waitForDatabaseConnection = async () => {
    while (!isReady) {
      await new Promise((r) => setTimeout(r, 10));
    }
  };

  return {
    getEntityManager,
    save: createDatabaseSaver(getEntityManager),
    waitForDatabaseConnection,
  };
};
