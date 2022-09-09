import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import dotenv from 'dotenv';

import { SqlComment, SqlReaction, SqlSession, SqlThread, SqlUser } from '../entities';

dotenv.config();

// used by the cli
const {
  DATABASE_HOST: host,
  DATABASE_USER: user,
  DATABASE_PASSWORD: password,
  DATABASE_NAME: dbName,
} = process.env;

const config: Options<PostgreSqlDriver> = {
  type: 'postgresql',
  host,
  user,
  password,
  dbName,
  debug: false,
  metadataProvider: TsMorphMetadataProvider,
  entities: [SqlComment, SqlReaction, SqlSession, SqlThread, SqlUser],
  cache: { options: { cacheDir: 'node_modules/.cache/mikro-orm' } },
  migrations: {
    path: 'src/persistence/migrations',
    snapshot: false,
    disableForeignKeys: false,
  },
  pool: { min: 0, max: 3, idleTimeoutMillis: 5000 },
};

export default config;
