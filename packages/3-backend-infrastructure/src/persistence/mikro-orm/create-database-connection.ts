import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

import config from './mikro-orm.config';

export const createDatabaseConnection = async (dbName: string) => {
  return MikroORM.init<PostgreSqlDriver>({ ...config, dbName });
};

export const createTestDatabaseConnection = async () => {
  const orm = await createDatabaseConnection('test');
  const schemaGenerator = orm.getSchemaGenerator();

  await schemaGenerator.refreshDatabase();

  return orm;
};
