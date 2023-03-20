import { AsyncFactory, token } from 'brandi';

import { Orm } from './create-orm';
import { OrmContext } from './orm-context';

export const PERSISTENCE_TOKENS = {
  ormFactory: token<AsyncFactory<Orm>>('AsyncFactory<orm>'),
  orm: token<Orm>('orm'),
  ormContext: token<OrmContext>('ormContext'),
};
