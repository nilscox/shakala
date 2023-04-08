import { token } from 'brandi';

import { Database } from './database';
import { OrmContext } from './orm-context';

export const PERSISTENCE_TOKENS = {
  database: token<Database>('database'),
  ormContext: token<OrmContext>('ormContext'),
};
