import { RequestContext } from '@mikro-orm/core';
import { injected } from 'brandi';

import { Database } from './database';
import { PERSISTENCE_TOKENS } from './tokens';

export class OrmContext {
  constructor(private readonly database: Database) {}

  public middleware(next: () => void) {
    if (this.database.initialized) {
      RequestContext.create(this.database.em, next);
    } else {
      next();
    }
  }
}

injected(OrmContext, PERSISTENCE_TOKENS.database);
