import { RequestContext } from '@mikro-orm/core';
import { AsyncFactory, injected } from 'brandi';

import { Orm } from './create-orm';
import { PERSISTENCE_TOKENS } from './tokens';

export class OrmContext {
  constructor(private readonly getOrm: AsyncFactory<Orm>) {}

  public async middleware(next: () => void) {
    const orm = await this.getOrm();

    RequestContext.create(orm.em, next);
  }
}

injected(OrmContext, PERSISTENCE_TOKENS.ormFactory);
