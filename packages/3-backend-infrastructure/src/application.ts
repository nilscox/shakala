import { MikroORM, RequestContext } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';

import { CommandBus, QueryBus, RealCommandBus, RealQueryBus } from './infrastructure';
import {
  CommandHandlers,
  instantiateRepositories,
  instantiateServices,
  QueryHandlers,
  registerHandlers,
  Repositories,
  Services,
} from './instantiate-dependencies';
import { createDatabaseConnection } from './persistence/mikro-orm/create-database-connection';

export class Application {
  protected queryBus = new RealQueryBus();
  protected commandBus = new RealCommandBus();

  protected services!: Services;
  protected serviceOverrides: Partial<Services> = {};

  protected repositories!: Repositories;

  protected commands!: CommandHandlers;
  protected queries!: QueryHandlers;

  protected orm!: MikroORM;

  overrideServices(services: Partial<Services>) {
    this.serviceOverrides = { ...this.serviceOverrides, ...services };
  }

  protected get logger() {
    return this.services.loggerService;
  }

  protected get config() {
    return this.services.configService;
  }

  async init() {
    this.services = {
      ...instantiateServices(this.queryBus),
      ...this.serviceOverrides,
    };

    const databaseConfig = this.config.database();

    this.logger.log('connecting to the database');

    this.orm = await this.createDatabaseConnection({
      host: databaseConfig.host,
      user: databaseConfig.user,
      password: databaseConfig.password,
      dbName: databaseConfig.database,
    });

    this.repositories = instantiateRepositories(this.orm.em.fork() as EntityManager, this.services);

    this.logger.log('registering queries and commands handlers');

    registerHandlers(this.queryBus, this.commandBus, this.services, this.repositories);

    this.logger.info('application initialized');
  }

  async close() {
    this.logger.info('closing application');
    await this.orm.close();
  }

  async run<T>(cb: (params: { commandBus: CommandBus; queryBus: QueryBus }) => Promise<T>): Promise<T> {
    return RequestContext.createAsync(this.orm.em, () => {
      return cb({ commandBus: this.commandBus, queryBus: this.queryBus });
    });
  }

  protected createDatabaseConnection = createDatabaseConnection;
}
