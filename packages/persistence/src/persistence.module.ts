import { Module } from '@shakala/common';

import { createOrm, Orm } from './create-orm';
import { OrmContext } from './orm-context';
import { PERSISTENCE_TOKENS } from './tokens';

export class PersistenceModule extends Module {
  configure(): void {
    this.bind(PERSISTENCE_TOKENS.orm).toFactory(
      () => createOrm(),
      (orm) => this.initOrm(orm)
    );

    this.bind(PERSISTENCE_TOKENS.ormContext).toInstance(OrmContext).inContainerScope();

    this.container.use(PERSISTENCE_TOKENS.orm).from(this);
    this.container.use(PERSISTENCE_TOKENS.ormContext).from(this);
  }

  async init(): Promise<void> {
    await this.container.get(PERSISTENCE_TOKENS.ormContext).init();
  }

  private async initOrm(orm: Orm) {
    await orm.connect();
    await this.waitForDatabaseConnection(orm);
  }

  private async waitForDatabaseConnection(orm: Orm) {
    const start = new Date().getTime();
    const elapsed = () => new Date().getTime() - start;

    while (!(await orm.isConnected())) {
      await new Promise((r) => setTimeout(r, 100));

      if (elapsed() > 1000) {
        throw new Error('Timeout waiting form database to be connected');
      }
    }
  }
}
