import { UnauthenticatedError } from 'backend-application';
import express from 'express';
import supertest from 'supertest';

import { MockLoggerService } from '../services';

import { Controller, RequestHandler } from './controller';
import { Response } from './response';

describe('Controller', () => {
  const logger = new MockLoggerService();

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
      throw new UnauthenticatedError();
    });

    const app = express();

    controller.configure(app);

    const response = await supertest(app).get('/');

    expect(response.statusCode).toEqual(403);
    expect(response.body).toHaveProperty('details.message', 'unauthenticated');
  });

  it('logs an error when the error could not be handled', async () => {
    const error = new Error('nope');

    const controller = TestController.create(() => {
      throw error;
    });

    const app = express();

    controller.configure(app);

    await supertest(app).get('/');

    expect(logger.error).toHaveBeenCalledWith('error handling request', error);
  });
});
