import path from 'node:path';
import url from 'node:url';

import { defineConfig } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import dotenv from 'dotenv';

import * as entities from './entities';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

dotenv.config({
  path: path.resolve(__dirname, '..', '.env'),
});

export default defineConfig<PostgreSqlDriver>({
  metadataProvider: TsMorphMetadataProvider,
  type: 'postgresql',
  entities: Object.values(entities),
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  dbName: process.env.DATABASE_NAME,
  cache: {
    options: {
      cacheDir: 'node_modules/.cache/mikro-orm',
    },
  },
  migrations: {
    path: path.resolve(__dirname, 'migrations'),
    snapshot: false,
    disableForeignKeys: false,
  },
  pool: {
    min: 0,
    max: 1,
  },
  driverOptions: {
    connection: {
      ssl: process.env.DATABASE_SECURE === 'true',
    },
  },
});
