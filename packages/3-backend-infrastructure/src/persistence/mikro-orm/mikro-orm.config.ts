import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

import { ConfigPort, EnvConfigAdapter } from '3-backend-infrastructure/src/infrastructure';

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

export const getConfig = (config: ConfigPort = new EnvConfigAdapter()): Options<PostgreSqlDriver> => {
  const { host, user, password, database, debug } = config.database();

  return {
    type: 'postgresql',
    host,
    user,
    password,
    dbName: database,
    debug,
    metadataProvider: TsMorphMetadataProvider,
    entities,
    cache: {
      options: { cacheDir: 'node_modules/.cache/mikro-orm' },
    },
    migrations: {
      path: 'src/persistence/migrations',
      snapshot: false,
      disableForeignKeys: false,
    },
    pool: {
      min: 0,
      max: 10,
      // cspell:word millis
      idleTimeoutMillis: 5000,
    },
  };
};

export default getConfig();
