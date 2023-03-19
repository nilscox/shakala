import { RequestContext } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { injected } from 'brandi';

import { Orm } from './create-orm';
import { PERSISTENCE_TOKENS } from './tokens';

export class OrmContext {
  orm?: Orm;

  constructor(private readonly getOrm: () => Promise<Orm>) {}

  async init() {
    this.orm = await this.getOrm();
  }

  public middleware(next: () => void) {
    RequestContext.create(this.orm?.em as EntityManager, next);
  }
}

injected(OrmContext, PERSISTENCE_TOKENS.orm);
