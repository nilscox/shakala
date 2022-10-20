import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import dotenv from 'dotenv';

import {
  SqlComment,
  SqlCommentReport,
  SqlProfileImage,
  SqlReaction,
  SqlSession,
  SqlThread,
  SqlUser,
  SqlUserActivity,
} from '../entities';

dotenv.config();

// used by the cli
const {
  DATABASE_HOST: host,
  DATABASE_USER: user,
  DATABASE_PASSWORD: password,
  DATABASE_NAME: dbName,
  DATABASE_DEBUG: debug,
} = process.env;

const entities = [
  SqlComment,
  SqlCommentReport,
  SqlProfileImage,
  SqlReaction,
  SqlSession,
  SqlThread,
  SqlUser,
  SqlUserActivity,
];

const config: Options<PostgreSqlDriver> = {
  type: 'postgresql',
  host,
  user,
  password,
  dbName,
  debug: debug === 'true',
  metadataProvider: TsMorphMetadataProvider,
  entities,
  cache: { options: { cacheDir: 'node_modules/.cache/mikro-orm' } },
  migrations: {
    path: 'src/persistence/migrations',
    snapshot: false,
    disableForeignKeys: false,
  },
  // cspell:word millis
  pool: { min: 0, max: 3, idleTimeoutMillis: 5000 },
};

export default config;
