import { Server as HttpServer } from 'http';
import { promisify } from 'util';

import { BaseError, ConfigPort, LoggerPort, TOKENS } from '@shakala/common';
import bodyParser from 'body-parser';
import { injected } from 'brandi';
import cookieParser from 'cookie-parser';
import express, { ErrorRequestHandler, Express, RequestHandler } from 'express';
import * as yup from 'yup';

import { container } from '../container';
import { API_TOKENS } from '../tokens';

export class Server {
  protected app: Express;
  protected server?: HttpServer;

  constructor(private readonly logger: LoggerPort, private readonly config: ConfigPort) {
    this.app = express();

    this.app.use(cookieParser('secret'));
    this.app.use(bodyParser.json());

    this.app.use('/auth', container.get(API_TOKENS.controllers.authController).router);
    this.app.use('/user', container.get(API_TOKENS.controllers.userController).router);
    this.app.use('/thread', container.get(API_TOKENS.controllers.threadController).router);
    this.app.use('/comment', container.get(API_TOKENS.controllers.commentController).router);

    this.app.use(this.validationErrorHandler);
    this.app.use(this.baseErrorHandler);
    this.app.use(this.fallbackErrorHandler);
    this.app.use(this.notFoundHandler);
  }

  async listen() {
    const { host, port } = this.config.app;

    await new Promise<void>((resolve, reject) => {
      try {
        this.server = this.app.listen(port, host, resolve);
      } catch (error) {
        reject(error);
      }
    });

    this.logger.info(`Server listening on ${host}:${port}`);
  }

  async close() {
    if (this.server) {
      await promisify<void>(this.server.close.bind(this.server))();
    }
  }

  private validationErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
    if (!yup.ValidationError.isError(error)) {
      next(error);
      return;
    }

    const body = {
      code: 'ValidationError',
      fields: error.inner.map((error) => ({
        path: error.path,
        type: error.type,
        value: error.params?.value,
        message: error.message,
      })),
    };

    res.status(400);
    res.json(body);
  };

  private baseErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
    if (!(error instanceof BaseError)) {
      next(error);
      return;
    }

    res.status(error.status ?? 500);
    res.send(error.serialize());
  };

  private fallbackErrorHandler: ErrorRequestHandler = (error, req, res, _next) => {
    const body: Record<string, unknown> = {
      code: 'InternalServerError',
    };

    if (error instanceof Error) {
      body.message = error.message;
    }

    console.error(error);

    res.status(500);
    res.send(body);
  };

  private notFoundHandler: RequestHandler = (req, res) => {
    res.status(404);
    res.end();
  };
}

injected(Server, TOKENS.logger, TOKENS.config);
