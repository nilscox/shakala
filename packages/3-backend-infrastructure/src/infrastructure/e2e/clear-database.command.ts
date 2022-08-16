import { MikroORM } from '@mikro-orm/core';
import { Command, CommandHandler } from 'backend-application/src/cqs/command-handler';

export class ClearDatabaseCommand implements Command {}

export class ClearDatabaseHandler implements CommandHandler<ClearDatabaseCommand> {
  constructor(private readonly orm: MikroORM) {}

  async handle(): Promise<void> {
    const schemaGenerator = this.orm.getSchemaGenerator();

    await schemaGenerator.refreshDatabase();
    await schemaGenerator.clearDatabase();
  }
}