import { Server as HttpServer } from 'http';
import { promisify } from 'util';

import { MikroORM, RequestContext } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import cors from 'cors';
import express, { json } from 'express';
import session from 'express-session';

import { RealCommandBus, RealQueryBus } from './infrastructure';
import {
  CommandHandlers,
  Controllers,
  instantiateCommandAndQueries,
  instantiateControllers,
  instantiateRepositories,
  instantiateServices,
  QueryHandlers,
  Repositories,
  Services,
} from './instantiate-dependencies';
import { createDatabaseConnection } from './persistence/mikro-orm/create-database-connection';

export class Server {
  protected app = express();
  protected server!: HttpServer;

  readonly queryBus = new RealQueryBus();
  readonly commandBus = new RealCommandBus();

  private orm!: MikroORM;

  private repositories!: Repositories;
  private services!: Services;
  private commands!: CommandHandlers;
  private queries!: QueryHandlers;
  private controllers!: Controllers;

  async init() {
    this.orm = await createDatabaseConnection();

    this.instantiateDependencies();
    this.configureDefaultMiddlewares();
    this.registerHandlers();
    this.configureControllers();
  }

  async close() {
    await this.orm.close();

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

  private instantiateDependencies() {
    this.repositories = instantiateRepositories(this.orm.em as EntityManager);
    this.services = instantiateServices(this.queryBus);

    const commandsAndQueries = instantiateCommandAndQueries(this.repositories, this.services);
    this.commands = commandsAndQueries.commands;
    this.queries = commandsAndQueries.queries;

    this.controllers = instantiateControllers(this.commandBus, this.queryBus, this.services);
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

  private registerHandlers() {
    for (const [Query, handler] of this.queries.entries()) {
      this.queryBus.register(Query, handler);
    }

    for (const [Command, handler] of this.commands.entries()) {
      this.commandBus.register(Command, handler);
    }
  }

  private configureControllers() {
    for (const controller of this.controllers) {
      controller.configure(this.app);
    }
  }
}
