import { ConfigPort, TOKENS } from '@shakala/common';
import { assert } from '@shakala/shared';
import { injected } from 'brandi';

import { createOrm, Orm } from './create-orm';

export class Database {
  private orm?: Orm;

  constructor(private readonly config: ConfigPort) {}

  get initialized() {
    return this.orm !== undefined;
  }

  get em() {
    assert(this.orm, 'database is not initialized');
    return this.orm.em;
  }

  async init() {
    this.orm = await createOrm(this.config.database);

    await this.orm.connect();
    await this.waitForDatabaseConnection();
  }

  async close() {
    await this.orm?.close(true);
  }

  private async waitForDatabaseConnection() {
    const start = new Date().getTime();
    const elapsed = () => new Date().getTime() - start;

    while (!(await this.em.getConnection().isConnected())) {
      await new Promise((r) => setTimeout(r, 100));

      if (elapsed() > 2000) {
        throw new Error('Timeout waiting form database to be connected');
      }
    }
  }

  async reset() {
    const orm = this.orm;
    assert(orm);

    const schemaGenerator = orm.getSchemaGenerator();

    await schemaGenerator.refreshDatabase();
    await schemaGenerator.clearDatabase();
  }
}

injected(Database, TOKENS.config);
