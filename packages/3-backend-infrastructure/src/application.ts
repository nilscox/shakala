import { MikroORM, RequestContext } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';

import { CommandBus, QueryBus, RealCommandBus, RealQueryBus } from './infrastructure';
import {
  CommandHandlers,
  instantiateCommandAndQueries,
  instantiateRepositories,
  instantiateServices,
  QueryHandlers,
  Repositories,
  Services,
} from './instantiate-dependencies';
import { createDatabaseConnection } from './persistence/mikro-orm/create-database-connection';

export class Application {
  protected queryBus = new RealQueryBus();
  protected commandBus = new RealCommandBus();

  protected repositories!: Repositories;
  protected services!: Services;
  protected commands!: CommandHandlers;
  protected queries!: QueryHandlers;

  protected orm!: MikroORM;

  async init() {
    this.orm = await this.createDatabaseConnection();

    this.instantiateDependencies();
    this.registerHandlers();
  }

  async close() {
    await this.orm.close();
  }

  async run<T>(cb: (params: { commandBus: CommandBus; queryBus: QueryBus }) => Promise<T>): Promise<T> {
    return RequestContext.createAsync(this.orm.em, () => {
      return cb({ commandBus: this.commandBus, queryBus: this.queryBus });
    });
  }

  protected createDatabaseConnection = createDatabaseConnection;

  private instantiateDependencies() {
    this.repositories = instantiateRepositories(this.orm.em.fork() as EntityManager);
    this.services = instantiateServices(this.queryBus);

    const commandsAndQueries = instantiateCommandAndQueries(this.repositories, this.services);

    this.commands = commandsAndQueries.commands;
    this.queries = commandsAndQueries.queries;
  }

  private registerHandlers() {
    for (const [Query, handler] of this.queries.entries()) {
      this.queryBus.register(Query, handler);
    }

    for (const [Command, handler] of this.commands.entries()) {
      this.commandBus.register(Command, handler);
    }
  }
}
