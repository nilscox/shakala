import { RequestContext } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { injected } from 'brandi';

import { Orm } from './create-orm';
import { PERSISTENCE_TOKENS } from './tokens';

export class OrmContext {
  constructor(private readonly orm: Orm) {}

  public middleware(next: () => void) {
    RequestContext.create(this.orm?.em as EntityManager, next);
  }
}

injected(OrmContext, PERSISTENCE_TOKENS.orm);
