import { token } from 'brandi';

import { Database } from './database';

export const PERSISTENCE_TOKENS = {
  database: token<Database>('database'),
};
