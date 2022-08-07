import { Server as HttpServer } from 'http';
import { promisify } from 'util';

import { RequestContext } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import connectPgSimple, { PGStore } from 'connect-pg-simple';
import cors from 'cors';
import express, { json } from 'express';
import session from 'express-session';
import { pick } from 'shared';

import { Application } from './application';
import { AuthenticationController } from './controllers/authentication/authentication.controller';
import { CommentController } from './controllers/comment/comment.controller';
import { HealthcheckController } from './controllers/healthcheck/healthcheck.controller';
import { ThreadController } from './controllers/thread/thread.controller';

const PgSession = connectPgSimple(session);

export class Server extends Application {
  protected app = express();
  protected server?: HttpServer;
  protected sessionStore?: PGStore;

  override async init() {
    await super.init();

    const configService = this.services.configService;
    const appConfig = configService.app();

    this.app.disable('x-powered-by');

    if (appConfig.trustProxy) {
      this.app.set('trust proxy', 1);
    }

    this.configureDefaultMiddlewares();
    this.configureControllers();

    console.info('server initialized');
    console.dir(configService.dump(), { depth: null });
  }

  override async close() {
    await super.close();

    if (this.server) {
      await promisify(this.server.close)();
    }

    await this.sessionStore?.close();
  }

  async start() {
    await new Promise<void>((resolve) => {
      this.server = this.app.listen(3000, resolve);
    });

    console.info('server listening on port 3000');
  }

  private configureDefaultMiddlewares() {
    const { configService } = this.services;

    const corsConfig = configService.cors();
    const sessionConfig = configService.session();
    const databaseConfig = configService.database();

    this.app.use(json());

    this.app.use(
      cors({
        origin: corsConfig.reflectOrigin,
        credentials: true,
      }),
    );

    this.sessionStore = new PgSession({
      conObject: pick(databaseConfig, 'host', 'user', 'password', 'database'),
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
      RequestContext.create(this.orm.em, next);
    });
  }

  private configureControllers() {
    const { validationService, sessionService } = this.services;
    const { queryBus, commandBus } = this;

    const controllers = [
      new HealthcheckController(this.orm.em as EntityManager),
      new AuthenticationController(validationService, sessionService, queryBus, commandBus),
      new ThreadController(queryBus, commandBus, sessionService, validationService),
      new CommentController(queryBus, commandBus, sessionService, validationService),
    ];

    for (const controller of controllers) {
      controller.configure(this.app);
    }
  }
}
