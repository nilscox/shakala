import { MikroORM, Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

import config from './mikro-orm.config';

export const createDatabaseConnection = async (override: Options<PostgreSqlDriver> = {}) => {
  return MikroORM.init<PostgreSqlDriver>({ ...config, ...override });
};

export const createTestDatabaseConnection = async (override: Options<PostgreSqlDriver> = {}) => {
  const orm = await createDatabaseConnection({ dbName: 'test', ...override });
  const schemaGenerator = orm.getSchemaGenerator();

  await schemaGenerator.refreshDatabase();

  return orm;
};
