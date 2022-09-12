import { Server as HttpServer } from 'http';
import { promisify } from 'util';

import { RequestContext } from '@mikro-orm/core';
import connectPgSimple, { PGStore } from 'connect-pg-simple';
import cors from 'cors';
import express, { json } from 'express';
import session from 'express-session';
import { pick } from 'shared';

import { Application } from './application';
import { ExpressSessionService, ValidationService } from './infrastructure';
import { AuthenticationController } from './modules/authentication/authentication.controller';
import { CommentController } from './modules/comment/comment.controller';
import { HealthcheckController } from './modules/healthcheck/healthcheck.controller';
import { ThreadController } from './modules/thread/thread.controller';

const PgSession = connectPgSimple(session);

export class Server extends Application {
  protected app = express();
  protected server?: HttpServer;
  protected sessionStore?: PGStore;

  override async init() {
    await super.init();

    const appConfig = this.config.app();

    this.app.disable('x-powered-by');

    if (appConfig.trustProxy) {
      this.app.set('trust proxy', 1);
    }

    this.logger.log('configuring request middlewares');
    this.configureDefaultMiddlewares();

    this.logger.log('configuring controllers');
    this.configureControllers();

    this.logger.info('server initialized');
    this.logger.log('configuration', JSON.stringify(this.config.dump()));
  }

  override async close() {
    this.logger.log('closing server');

    if (this.server) {
      await promisify<void>(cb => this.server?.close(cb))();
    }

    await this.sessionStore?.close();

    await super.close();

    this.logger.info('server closed');
  }

  async start() {
    const { host, port } = this.config.app();

    await new Promise<void>((resolve) => {
      this.server = this.app.listen(port, resolve);
    });

    this.logger.info(`server listening on ${host}:${port}`);
  }

  private configureDefaultMiddlewares() {
    const corsConfig = this.config.cors();
    const sessionConfig = this.config.session();
    const databaseConfig = this.config.database();

    this.app.use(json());

    this.app.use(
      cors({
        origin: corsConfig.reflectOrigin,
        credentials: true,
      }),
    );

    this.sessionStore = new PgSession({
      conObject: pick(databaseConfig, 'host', 'user', 'password', 'database'),
      pruneSessionInterval: sessionConfig.pruneExpiredSessions ? false : undefined,
    });

    this.app.use(
      session({
        store: this.sessionStore,
        secret: sessionConfig.secret,
        cookie: {
          secure: sessionConfig.secure,
          httpOnly: true,
          sameSite: 'strict',
          // 60 days
          maxAge: 1000 * 60 * 60 * 24 * 60,
        },
        resave: false,
        saveUninitialized: true,
      }),
    );

    this.app.use((_req, _res, next) => {
      RequestContext.create(this.em, next);
    });
  }

  private configureControllers() {
    const { queryBus, commandBus, em, logger, config } = this;

    const validationService = new ValidationService();
    const sessionService = new ExpressSessionService(queryBus);

    const controllers = [
      new HealthcheckController(logger, em),
      new AuthenticationController(logger, config, validationService, sessionService, queryBus, commandBus),
      new ThreadController(logger, queryBus, commandBus, sessionService, validationService),
      new CommentController(logger, queryBus, commandBus, sessionService, validationService),
    ];

    for (const controller of controllers) {
      controller.configure(this.app);
    }
  }
}
