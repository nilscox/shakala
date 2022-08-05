import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import dotenv from 'dotenv';

import { Comment } from '../entities/sql-comment.entity';
import { Reaction } from '../entities/sql-reaction.entity';
import { Thread } from '../entities/sql-thread.entity';
import { User } from '../entities/sql-user.entity';

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
  entities: [User, Thread, Comment, Reaction],
  cache: { options: { cacheDir: 'node_modules/.cache/mikro-orm' } },
  migrations: {
    path: 'src/persistence/migrations',
    snapshot: false,
  },
};

export default config;
