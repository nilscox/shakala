import { AuthorizationError } from 'backend-application';
import express, { RequestHandler as ExpressRequestHandler } from 'express';
import { AuthorizationErrorReason } from 'shared';
import { mockImpl } from 'shared/test';
import supertest from 'supertest';

import { MockLoggerAdapter } from '../test';

import { Controller, Middlewares, RequestHandler } from './controller';
import { NotFound } from './http-errors';
import { Response } from './response';

describe('Controller', () => {
  const logger = new MockLoggerAdapter();

  abstract class TestController extends Controller {
    constructor() {
      super(logger, '/');
    }

    endpoints(): Record<string, RequestHandler> {
      return {
        'GET /': this.endpoint,
      };
    }

    abstract endpoint(): Response;

    static create(endpoint: TestController['endpoint']) {
      return new (class extends TestController {
        endpoint = endpoint;
      })();
    }
  }

  it('adds headers to the response', async () => {
    const controller = TestController.create(() => {
      const response = Response.noContent();

      response.headers.set('x-test', 'true');

      return response;
    });

    const app = express();

    controller.configure(app);

    const response = await supertest(app).get('/');

    expect(response.headers).toHaveProperty('x-test', 'true');
  });

  it('fails with a 403 Forbidden error when the endpoint throws an AuthorizationError', async () => {
    const controller = TestController.create(() => {
      throw new AuthorizationError(AuthorizationErrorReason.unauthenticated);
    });

    const app = express();

    controller.configure(app);

    const response = await supertest(app).get('/');

    expect(response.statusCode).toEqual(403);
    expect(response.body).toHaveProperty('details.reason', AuthorizationErrorReason.unauthenticated);
  });

  it('logs an error when the error could not be handled', async () => {
    const error = new Error('nope');

    const controller = TestController.create(() => {
      throw error;
    });

    const app = express();

    controller.configure(app);

    await supertest(app).get('/');

    expect(logger.error).toHaveBeenCalledWith(error);
  });

  it('returns a response body of type string', async () => {
    const controller = TestController.create(() => {
      return Response.ok('test');
    });

    const app = express();

    controller.configure(app);

    const response = await supertest(app).get('/');

    expect(response.get('Content-Type')).toEqual('text/plain; charset=utf-8');
    expect(response.text).toEqual('test');
  });

  it('returns a response body of type Buffer', async () => {
    const controller = TestController.create(() => {
      return Response.ok(Buffer.from('test'));
    });

    const app = express();

    controller.configure(app);

    const response = await supertest(app).get('/');

    expect(response.get('Content-Type')).toEqual('application/octet-stream');
    expect(response.body).toEqual(Buffer.from('test'));
  });

  it('handles known errors, instances of HttpError', async () => {
    const controller = TestController.create(() => {
      throw new NotFound('this does not exist', { id: '42' });
    });

    const app = express();

    controller.configure(app);

    const response = await supertest(app).get('/');

    expect(response.status).toEqual(404);
    expect(response.body).toEqual({
      code: 'NotFound',
      message: 'this does not exist',
      details: {
        id: '42',
      },
    });
  });

  it('returns an internal server error when the error is not known', async () => {
    class CustomError extends Error {
      constructor() {
        super('nope');
      }
    }

    const error = new CustomError();

    const controller = TestController.create(() => {
      throw error;
    });

    const app = express();

    controller.configure(app);

    const response = await supertest(app).get('/');

    expect(response.status).toEqual(500);
    expect(response.body).toEqual({
      code: 'InternalServerError',
      message: 'nope',
      details: {
        error: 'CustomError',
        stack: error.stack,
      },
    });
  });

  it('registers express middlewares before the request handler', async () => {
    const middleware = mockImpl<ExpressRequestHandler>((_req, _res, next) => {
      next();
    });

    class TestController extends Controller {
      endpoints(): Record<string, RequestHandler> {
        return {
          'GET /': this.endpoint,
        };
      }

      @Middlewares(middleware)
      endpoint() {
        return Response.noContent();
      }
    }

    const controller = new TestController(logger, '/');
    const app = express();

    controller.configure(app);

    await supertest(app).get('/');

    expect(middleware).toHaveBeenCalled();
  });
});
