import { Options } from '@mikro-orm/core';
import { MikroORM, PostgreSqlDriver } from '@mikro-orm/postgresql';

import config from './mikro-orm.config';

export async function createOrm(overrides?: Partial<Options<PostgreSqlDriver>>) {
  return MikroORM.init({ ...config, ...overrides });
}

export type Orm = Awaited<ReturnType<typeof createOrm>>;
export type EM = Orm['em'];
