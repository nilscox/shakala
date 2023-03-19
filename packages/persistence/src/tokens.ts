import { AsyncFactory, token } from 'brandi';

import { Orm } from './create-orm';
import { OrmContext } from './orm-context';

export const PERSISTENCE_TOKENS = {
  orm: token<AsyncFactory<Orm>>('AsyncFactory<orm>'),
  ormContext: token<OrmContext>('ormContext'),
};
