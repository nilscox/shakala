import path from 'path';

import { MikroORM, RequestContext } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  InMemoryCommentReportRepository,
  InMemoryCommentRepository,
  InMemoryReactionRepository,
  InMemoryThreadRepository,
  InMemoryUserRepository,
  registerHandlers,
  Repositories,
  Services,
} from 'backend-application';
import { UserCreatedEvent } from 'backend-domain';

import {
  BcryptService,
  CommandBus,
  MathRandomGeneratorService,
  RealCommandBus,
  RealDateService,
  ConfigService,
  EnvConfigService,
  ConsoleLoggerService,
} from './infrastructure';
import { EventBus } from './infrastructure/cqs/event-bus';
import { QueryBus, RealQueryBus } from './infrastructure/cqs/query-bus';
import { ClearDatabaseCommand, ClearDatabaseHandler } from './infrastructure/e2e/clear-database.command';
import { MjmlEmailCompilerService } from './infrastructure/services/email/mjml-email-compiler.service';
import { NodeMailerEmailSenderService } from './infrastructure/services/email/node-mailer-email-sender.service';
import { RealFilesystemService } from './infrastructure/services/filesystem/real-filesystem.service';
import { SqlProfileImageStoreService } from './infrastructure/services/profile-image-store/sql-profile-image-store.service';
import { UserCreatedHandler } from './modules/authentication/user-created.handler';
import {
  SqlCommentRepository,
  SqlReactionRepository,
  SqlThreadRepository,
  SqlUserRepository,
} from './persistence';
import { createDatabaseConnection } from './persistence/mikro-orm/create-database-connection';
import { SqlCommentReportRepository } from './persistence/repositories/sql-comment-report.repository';

export class Application {
  private services = {} as Services & { configService: ConfigService };

  protected commandBus!: RealCommandBus;
  protected queryBus!: RealQueryBus;
  protected eventBus!: EventBus;

  protected orm?: MikroORM;
  private repositories!: Repositories;

  protected get logger() {
    return this.services.loggerService;
  }

  protected get config() {
    return this.services.configService;
  }

  protected get em() {
    if (!this.orm) {
      throw new Error('Application.orm is not defined');
    }

    return this.orm.em.fork() as EntityManager;
  }

  overrideServices(services: Partial<Services & { configService: ConfigService }>) {
    Object.assign(this.services, services);
  }

  async init() {
    this.services.dateService ??= new RealDateService();
    this.services.loggerService ??= new ConsoleLoggerService(this.services.dateService);
    this.services.configService ??= new EnvConfigService();

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
        commentReportRepository: new SqlCommentReportRepository(em, this.services),
      };
    } else {
      this.logger.log('instantiating in-memory repositories');

      const reactionRepository = new InMemoryReactionRepository();

      this.repositories = {
        userRepository: new InMemoryUserRepository(),
        threadRepository: new InMemoryThreadRepository(),
        reactionRepository,
        commentRepository: new InMemoryCommentRepository(reactionRepository),
        commentReportRepository: new InMemoryCommentReportRepository(),
      };
    }

    this.logger.log('instantiating services');

    this.services.filesystemService ??= new RealFilesystemService(path.resolve(__dirname, '..'));
    this.services.generatorService ??= new MathRandomGeneratorService();
    this.services.cryptoService ??= new BcryptService();

    this.services.emailCompilerService ??= new MjmlEmailCompilerService(this.services.filesystemService);
    this.services.emailSenderService ??= new NodeMailerEmailSenderService(this.services.configService);
    this.services.profileImageStoreService ??= new SqlProfileImageStoreService(this.em);

    this.logger.log('instantiating CQS dependencies');

    this.commandBus = new RealCommandBus();
    this.queryBus = new RealQueryBus();
    this.eventBus = new EventBus(this.services.loggerService);

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

    this.logger.log('initializing query and command handlers');

    await this.queryBus.init();
    await this.commandBus.init();

    this.logger.log('registering domain event handlers');

    this.eventBus.registerHandler(
      UserCreatedEvent,
      new UserCreatedHandler(this.config, this.repositories.userRepository, this.commandBus),
    );

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
