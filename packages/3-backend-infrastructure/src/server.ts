import { Server as HttpServer } from 'http';
import { promisify } from 'util';

import { RequestContext } from '@mikro-orm/core';
import cors from 'cors';
import express, { json } from 'express';
import session from 'express-session';

import { Application } from './application';
import { Controllers, instantiateControllers } from './instantiate-dependencies';

export class Server extends Application {
  protected app = express();
  protected server!: HttpServer;

  private controllers!: Controllers;

  override async init() {
    await super.init();

    this.controllers = instantiateControllers(this.commandBus, this.queryBus, this.services);

    this.configureDefaultMiddlewares();
    this.configureControllers();
  }

  override async close() {
    await super.close();

    if (this.server) {
      await promisify(this.server.close)();
    }
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

    this.app.use(json());

    this.app.use(
      cors({
        origin: corsConfig.reflectOrigin,
        credentials: true,
      }),
    );

    this.app.use(
      session({
        secret: sessionConfig.secret,
        cookie: {
          secure: sessionConfig.secure,
          httpOnly: true,
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
    for (const controller of this.controllers) {
      controller.configure(this.app);
    }
  }
}
