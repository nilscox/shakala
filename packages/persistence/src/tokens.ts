import { AsyncFactory, token } from 'brandi';

import { Orm } from './create-orm';
import { Database } from './database';
import { OrmContext } from './orm-context';

export const PERSISTENCE_TOKENS = {
  ormFactory: token<AsyncFactory<Orm>>('AsyncFactory<orm>'),
  database: token<Database>('database'),
  ormContext: token<OrmContext>('ormContext'),
};
