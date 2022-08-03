import { MikroORM, Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

import config from './mikro-orm.config';

export const createDatabaseConnection = async (override: Options<PostgreSqlDriver> = {}) => {
  return MikroORM.init<PostgreSqlDriver>({ ...config, ...override });
};

export const createTestDatabaseConnection = async () => {
  const orm = await createDatabaseConnection({ dbName: 'test' });
  const schemaGenerator = orm.getSchemaGenerator();

  await schemaGenerator.refreshDatabase();

  return orm;
};
