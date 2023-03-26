import assert from 'assert';

import { AsyncFactory, injected } from 'brandi';

import { Orm } from './create-orm';
import { PERSISTENCE_TOKENS } from './tokens';

export class Database {
  private orm?: Orm;

  constructor(private readonly getOrm: AsyncFactory<Orm>) {}

  get em() {
    assert(this.orm, 'database is not initialized');
    return this.orm.em;
  }

  async init() {
    this.orm = await this.getOrm();

    await this.orm.connect();
    await this.waitForDatabaseConnection(this.orm);
  }

  async close() {
    await this.orm?.close(true);
  }

  private async waitForDatabaseConnection(orm: Orm) {
    const start = new Date().getTime();
    const elapsed = () => new Date().getTime() - start;

    while (!(await orm.isConnected())) {
      await new Promise((r) => setTimeout(r, 100));

      if (elapsed() > 2000) {
        throw new Error('Timeout waiting form database to be connected');
      }
    }
  }

  async reset() {
    const orm = this.orm ?? (await this.getOrm());

    const schemaGenerator = orm.getSchemaGenerator();

    await schemaGenerator.refreshDatabase();
    await schemaGenerator.clearDatabase();
  }
}

injected(Database, PERSISTENCE_TOKENS.ormFactory);
