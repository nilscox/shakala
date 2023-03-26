import { Module } from '@shakala/common';
import { pick } from '@shakala/shared';

import { createOrm } from './create-orm';
import { Database } from './database';
import { OrmContext } from './orm-context';
import { PERSISTENCE_TOKENS } from './tokens';

type PersistenceModuleConfig = {
  useDatabase: boolean;
  allowGlobalContext?: boolean;
  dbName?: string;
};

export class PersistenceModule extends Module {
  private useDatabase = false;

  configure(config: PersistenceModuleConfig): void {
    this.useDatabase = config.useDatabase;

    this.bind(PERSISTENCE_TOKENS.ormFactory).toFactory(() =>
      createOrm(removeUndefinedValues(pick(config, 'allowGlobalContext', 'dbName')))
    );

    this.bind(PERSISTENCE_TOKENS.database).toInstance(Database).inContainerScope();
    this.bind(PERSISTENCE_TOKENS.ormContext).toInstance(OrmContext).inContainerScope();

    this.container.use(PERSISTENCE_TOKENS.database).from(this);
    this.container.use(PERSISTENCE_TOKENS.ormContext).from(this);
  }

  async init() {
    if (this.useDatabase) {
      await this.container.get(PERSISTENCE_TOKENS.database).init();
    }
  }
}

const removeUndefinedValues = <T extends object>(obj: T): T => {
  return Object.entries(obj).reduce((obj, [key, value]) => {
    if (value === undefined) {
      return obj;
    }

    return { ...obj, [key]: value };
  }, {} as T);
};
