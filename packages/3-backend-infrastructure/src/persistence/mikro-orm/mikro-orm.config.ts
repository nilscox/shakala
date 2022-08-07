import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import dotenv from 'dotenv';

import { SqlComment, SqlReaction, SqlThread, SqlUser } from '../entities';

dotenv.config();

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
  entities: [SqlUser, SqlThread, SqlComment, SqlReaction],
  cache: { options: { cacheDir: 'node_modules/.cache/mikro-orm' } },
  migrations: {
    path: 'src/persistence/migrations',
    snapshot: false,
  },
};

export default config;
