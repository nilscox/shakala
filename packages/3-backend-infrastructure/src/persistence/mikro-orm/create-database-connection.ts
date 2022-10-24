import { MikroORM, Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { wait } from 'shared';

import { ConfigPort } from '3-backend-infrastructure/src/infrastructure';

import { createDatabaseSaver } from '../utils/save-test-data';

import { getConfig } from './mikro-orm.config';

export const createDatabaseConnection = async (config?: ConfigPort, options?: Options<PostgreSqlDriver>) => {
  return MikroORM.init<PostgreSqlDriver>({ ...getConfig(config), ...options });
};

export const resetDatabase = async (orm: MikroORM) => {
  const schemaGenerator = orm.getSchemaGenerator();

  await schemaGenerator.refreshDatabase();
  await schemaGenerator.clearDatabase();
};

export const setupTestDatabase = (options?: Options<PostgreSqlDriver>) => {
  let orm: MikroORM<PostgreSqlDriver>;
  let isReady = false;

  before(async () => {
    orm = await createDatabaseConnection(undefined, {
      dbName: 'test',
      ...options,
    });

    await resetDatabase(orm);
  });

  after(async () => {
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
      await wait(10);
    }
  };

  return {
    getEntityManager,
    save: createDatabaseSaver(getEntityManager),
    waitForDatabaseConnection,
  };
};
