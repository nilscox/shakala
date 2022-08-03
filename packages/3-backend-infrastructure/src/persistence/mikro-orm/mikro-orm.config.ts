import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import dotenv from 'dotenv';

import { Comment } from '../entities/sql-comment.entity';
import { Reaction } from '../entities/sql-reaction.entity';
import { Thread } from '../entities/sql-thread.entity';
import { User } from '../entities/sql-user.entity';

dotenv.config();

const config: Options<PostgreSqlDriver> = {
  type: 'postgresql',
  metadataProvider: TsMorphMetadataProvider,
  dbName: process.env['DB_NAME'],
  entities: [User, Thread, Comment, Reaction],
  cache: { options: { cacheDir: 'node_modules/.cache/mikro-orm' } },
};

export default config;
