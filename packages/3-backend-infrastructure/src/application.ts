import { MikroORM, RequestContext } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  InMemoryCommentRepository,
  InMemoryReactionRepository,
  InMemoryThreadRepository,
  InMemoryUserRepository,
  registerHandlers,
  Repositories,
  Services,
} from 'backend-application';
import { UserCreatedEvent } from 'backend-domain/src/events/user-created.event';

import {
  BcryptService,
  CommandBus,
  MathRandomGeneratorService,
  RealCommandBus,
  RealDateService,
  ConfigService as InfraConfigService,
  EnvConfigService,
  ConsoleLoggerService,
} from './infrastructure';
import { EventBus } from './infrastructure/cqs/event-bus';
import { QueryBus, RealQueryBus } from './infrastructure/cqs/query-bus';
import { ClearDatabaseCommand, ClearDatabaseHandler } from './infrastructure/e2e/clear-database.command';
import { UserCreatedHandler } from './modules/authentication/user-created.handler';
import {
  SqlCommentRepository,
  SqlReactionRepository,
  SqlThreadRepository,
  SqlUserRepository,
} from './persistence';
import { createDatabaseConnection } from './persistence/mikro-orm/create-database-connection';

const instantiateServices = (): Services => {
  const dateService = new RealDateService();

  return {
    configService: new EnvConfigService(),
    loggerService: new ConsoleLoggerService(dateService),
    generatorService: new MathRandomGeneratorService(),
    dateService,
    cryptoService: new BcryptService(),
  };
};

export class Application {
  protected commandBus = new RealCommandBus();
  protected queryBus = new RealQueryBus();

  private services = instantiateServices();
  private eventBus = new EventBus(this.logger);

  protected orm?: MikroORM;
  private repositories!: Repositories;

  protected get logger() {
    return this.services.loggerService;
  }

  protected get config(): InfraConfigService {
    return this.services.configService as InfraConfigService;
  }

  protected get em() {
    if (!this.orm) {
      throw new Error('Application.orm is not defined');
    }

    return this.orm.em.fork() as EntityManager;
  }

  overrideServices(services: Partial<Services>) {
    Object.assign(this.services, services);
  }

  async init() {
    if (true as boolean) {
      this.logger.log('connecting to the database');

      const databaseConfig = this.config.database();

      this.orm = await this.createDatabaseConnection({
        host: databaseConfig.host,
        user: databaseConfig.user,
        password: databaseConfig.password,
        dbName: databaseConfig.database,
      });

      this.logger.log('instantiating repositories');

      const em = this.em;

      this.repositories = {
        userRepository: new SqlUserRepository(em, this.services),
        threadRepository: new SqlThreadRepository(em, this.services),
        reactionRepository: new SqlReactionRepository(em, this.services),
        commentRepository: new SqlCommentRepository(em, this.services),
      };
    } else {
      this.logger.log('instantiating in-memory repositories');

      const reactionRepository = new InMemoryReactionRepository();

      this.repositories = {
        userRepository: new InMemoryUserRepository(),
        threadRepository: new InMemoryThreadRepository(),
        reactionRepository,
        commentRepository: new InMemoryCommentRepository(reactionRepository),
      };
    }

    this.logger.log('registering query and command handlers');

    registerHandlers(
      this.commandBus.register.bind(this.commandBus),
      this.queryBus.register.bind(this.queryBus),
      this.services,
      this.repositories,
      this.eventBus,
    );

    if (this.orm) {
      this.commandBus.register(ClearDatabaseCommand, new ClearDatabaseHandler(this.orm));
    }

    this.logger.log('registering domain event handlers');

    this.eventBus.registerHandler(UserCreatedEvent, new UserCreatedHandler(this.commandBus));

    this.logger.info('application initialized');
  }

  async close() {
    this.logger.info('closing application');

    if (this.orm) {
      await this.orm.close();
    }
  }

  async run<T>(cb: (params: { commandBus: CommandBus; queryBus: QueryBus }) => Promise<T>): Promise<T> {
    return RequestContext.createAsync(this.em, () => {
      return cb({ commandBus: this.commandBus, queryBus: this.queryBus });
    });
  }

  protected createDatabaseConnection = createDatabaseConnection;
}
