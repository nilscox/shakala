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
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
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
    max: 5,
  },
  driverOptions: {
    connection: {
      ssl: process.env.NODE_ENV === 'production',
    },
  },
});
