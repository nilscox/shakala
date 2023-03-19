import { createOrm, Orm } from './create-orm';

export interface RepositoryTest {
  arrange?(): Promise<void>;
}

export class RepositoryTest {
  protected orm!: Orm;

  async setup() {
    this.orm = await createOrm({
      dbName: 'tests',
      allowGlobalContext: true,
    });

    await this.configureOrm();
    await this.resetDatabase();

    await this.arrange?.();
  }

  async cleanup() {
    await this.orm?.close(true);
  }

  private async configureOrm() {
    this.orm.config.getLogger().setDebugMode(false);
  }

  private async resetDatabase() {
    const schemaGenerator = this.orm.getSchemaGenerator();

    await schemaGenerator.refreshDatabase();
    await schemaGenerator.clearDatabase();
  }
}
