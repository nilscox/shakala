import { Options, QBFilterQuery } from '@mikro-orm/core';
import { MikroORM, PostgreSqlDriver } from '@mikro-orm/postgresql';

import config from './mikro-orm.config';

export async function createOrm(overrides?: Partial<Options<PostgreSqlDriver>>) {
  // console.log({ ...config, ...overrides });
  return MikroORM.init({ ...config, ...overrides });
}

export type Orm = Awaited<ReturnType<typeof createOrm>>;
export type EM = Orm['em'];

export type FindOptions<SqlEntity> = QBFilterQuery<SqlEntity>;
