import { Server as HttpServer } from 'http';
import { promisify } from 'util';

import { BaseError } from '@shakala/common';
import bodyParser from 'body-parser';
import { injected } from 'brandi';
import cookieParser from 'cookie-parser';
import express, { ErrorRequestHandler, Express } from 'express';
import * as yup from 'yup';

import { AuthController } from '../controllers/auth.controller';
import { API_TOKENS } from '../tokens';

export class Server {
  protected app: Express;
  protected server?: HttpServer;

  constructor(private readonly authController: AuthController) {
    this.app = express();

    this.app.use(cookieParser('secret'));
    this.app.use(bodyParser.json());

    this.app.use('/auth', this.authController.router);

    this.app.use(this.validationErrorHandler);
    this.app.use(this.baseErrorHandler);
    this.app.use(this.fallbackErrorHandler);
  }

  async listen(host: string, port: number) {
    await new Promise<void>((resolve, reject) => {
      try {
        this.server = this.app.listen(port, host, resolve);
      } catch (error) {
        reject(error);
      }
    });
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

    res.status(400).send(body).end();
  };

  private baseErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
    if (!(error instanceof BaseError)) {
      next(error);
      return;
    }

    res
      .status(error.status ?? 500)
      .send(error.serialize())
      .end();
  };

  private fallbackErrorHandler: ErrorRequestHandler = (error, req, res, _next) => {
    const body: Record<string, unknown> = {
      code: 'InternalServerError',
    };

    if (error instanceof Error) {
      body.message = error.message;
    }

    console.error(error);

    res.status(500).send(body).end();
  };
}

injected(Server, API_TOKENS.authController);
