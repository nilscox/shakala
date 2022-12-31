import path from 'path';

import { MikroORM, RequestContext } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  InMemoryCommentReportRepository,
  InMemoryCommentRepository,
  InMemoryReactionRepository,
  InMemoryThreadRepository,
  InMemoryUserRepository,
  InMemoryUserActivityRepository,
  registerHandlers,
  Repositories,
  ApplicationDependencies,
  InMemoryNotificationRepository,
  InMemoryCommentSubscriptionRepository,
} from '@shakala/backend-application';
import {
  CommentCreatedEvent,
  CommentEditedEvent,
  CommentReactionSetEvent,
  CommentReplyCreatedEvent,
  CommentReportedEvent,
  DomainEvent,
  EmailAddressValidatedEvent,
  ProfileImageChangedEvent,
  ThreadCreatedEvent,
  UserAuthenticatedEvent,
  UserAuthenticationFailedEvent,
  UserCreatedEvent,
  UserSignedOutEvent,
} from '@shakala/backend-domain';
import { ClassType } from '@shakala/shared';

import {
  BcryptAdapter,
  CommandBus,
  MathRandomGeneratorAdapter,
  RealCommandBus,
  RealDateAdapter,
  ConfigPort,
  EnvConfigAdapter,
  ConsoleLoggerAdapter,
} from './infrastructure';
import { MjmlEmailCompilerAdapter } from './infrastructure/adapters/email/mjml-email-compiler.adapter';
import { NodeMailerEmailSenderAdapter } from './infrastructure/adapters/email/node-mailer-email-sender.adapter';
import { RealFilesystemAdapter } from './infrastructure/adapters/filesystem/real-filesystem.adapter';
import { SqlProfileImageStoreAdapter } from './infrastructure/adapters/profile-image-store/sql-profile-image-store.adapter';
import { EventBus } from './infrastructure/cqs/event-bus';
import { QueryBus, RealQueryBus } from './infrastructure/cqs/query-bus';
import { ClearDatabaseCommand, ClearDatabaseHandler } from './infrastructure/e2e/clear-database.command';
import { UserCreatedHandler } from './modules/authentication/user-created.handler';
import { CreateCommentReplyNotificationsHandlerInfra } from './modules/comment/create-comment-reply-notifications.handler';
import { CreateCommentSubscriptionHandler } from './modules/comment/create-comment-subscription.handler';
import { CreateUserActivityHandler } from './modules/profile/create-user-activity.handler';
import {
  SqlCommentRepository,
  SqlReactionRepository,
  SqlThreadRepository,
  SqlUserRepository,
} from './persistence';
import { createDatabaseConnection } from './persistence/mikro-orm/create-database-connection';
import { SqlCommentReportRepository } from './persistence/repositories/sql-comment-report.repository';
import { SqlCommentSubscriptionRepository } from './persistence/repositories/sql-comment-subscription.repository';
import { SqlNotificationRepository } from './persistence/repositories/sql-notification.repository';
import { SqlUserActivityRepository } from './persistence/repositories/sql-user-activity.repository';

export class Application {
  private adapters = {} as ApplicationDependencies & { config: ConfigPort };

  protected commandBus!: RealCommandBus;
  protected queryBus!: RealQueryBus;
  protected eventBus!: EventBus;

  protected orm?: MikroORM;
  protected repositories!: Repositories;

  protected get logger() {
    return this.adapters.logger;
  }

  protected get config() {
    return this.adapters.config;
  }

  protected get em() {
    if (!this.orm) {
      throw new Error('Application.orm is not defined');
    }

    return this.orm.em.fork() as EntityManager;
  }

  override(adapters: Partial<Application['adapters']>) {
    Object.assign(this.adapters, adapters);
  }

  async init() {
    this.adapters.date ??= new RealDateAdapter();
    this.adapters.logger ??= new ConsoleLoggerAdapter(this.adapters.date);
    this.adapters.config ??= new EnvConfigAdapter();

    if (true as boolean) {
      this.logger.log('connecting to the database');

      this.orm = await createDatabaseConnection(this.config);

      this.logger.log('instantiating repositories');

      const em = this.em;

      this.repositories = {
        userRepository: new SqlUserRepository(em, this.adapters),
        userActivityRepository: new SqlUserActivityRepository(em, this.adapters),
        notificationRepository: new SqlNotificationRepository(em, this.adapters),
        threadRepository: new SqlThreadRepository(em, this.adapters),
        reactionRepository: new SqlReactionRepository(em, this.adapters),
        commentRepository: new SqlCommentRepository(em, this.adapters),
        commentReportRepository: new SqlCommentReportRepository(em, this.adapters),
        commentSubscriptionRepository: new SqlCommentSubscriptionRepository(em, this.adapters),
      };
    } else {
      this.logger.log('instantiating in-memory repositories');

      const reactionRepository = new InMemoryReactionRepository();

      this.repositories = {
        userRepository: new InMemoryUserRepository(),
        userActivityRepository: new InMemoryUserActivityRepository(),
        notificationRepository: new InMemoryNotificationRepository(),
        threadRepository: new InMemoryThreadRepository(),
        reactionRepository,
        commentRepository: new InMemoryCommentRepository(reactionRepository),
        commentReportRepository: new InMemoryCommentReportRepository(),
        commentSubscriptionRepository: new InMemoryCommentSubscriptionRepository(),
      };
    }

    this.logger.log('instantiating adapters');

    this.adapters.filesystem ??= new RealFilesystemAdapter(path.resolve(__dirname, '..'));
    this.adapters.generator ??= new MathRandomGeneratorAdapter();
    this.adapters.crypto ??= new BcryptAdapter();

    this.adapters.emailCompiler ??= new MjmlEmailCompilerAdapter(this.adapters.filesystem);
    this.adapters.emailSender ??= new NodeMailerEmailSenderAdapter(this.adapters.config);
    this.adapters.profileImageStore ??= new SqlProfileImageStoreAdapter(this.em);

    this.logger.log('instantiating CQS dependencies');

    this.commandBus = new RealCommandBus();
    this.queryBus = new RealQueryBus();
    this.eventBus = new EventBus();

    this.logger.log('registering query and command handlers');

    registerHandlers(
      this.commandBus.register.bind(this.commandBus),
      this.queryBus.register.bind(this.queryBus),
      this.eventBus,
      this.repositories,
      this.adapters,
    );

    if (this.orm) {
      this.commandBus.register(ClearDatabaseCommand, new ClearDatabaseHandler(this.orm));
    }

    this.logger.log('initializing query and command handlers');

    await this.queryBus.init();
    await this.commandBus.init();

    this.logger.log('registering domain event handlers');

    this.eventBus.subscribe(
      UserCreatedEvent,
      new UserCreatedHandler(this.config, this.repositories.userRepository, this.commandBus),
    );

    this.eventBus.subscribe(
      CommentCreatedEvent,
      new CreateCommentSubscriptionHandler(this.commandBus, this.repositories.commentRepository),
    );

    this.eventBus.subscribe(
      CommentReplyCreatedEvent,
      new CreateCommentReplyNotificationsHandlerInfra(this.commandBus),
    );

    const events: Array<ClassType<DomainEvent>> = [
      EmailAddressValidatedEvent,
      ProfileImageChangedEvent,
      UserAuthenticationFailedEvent,
      UserSignedOutEvent,
      UserCreatedEvent,
      UserAuthenticatedEvent,
      ThreadCreatedEvent,
      CommentCreatedEvent,
      CommentEditedEvent,
      CommentReportedEvent,
      CommentReactionSetEvent,
    ];

    for (const event of events) {
      this.eventBus.subscribe(event, new CreateUserActivityHandler(this.commandBus));
    }

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
}
