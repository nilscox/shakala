import { LoggerService } from 'backend-application';
import express from 'express';
import supertest from 'supertest';

import { MockLoggerService } from '../services';

import { Controller, RequestHandler } from './controller';
import { Response } from './response';

describe('Controller', () => {
  it('adds headers to the response', async () => {
    class c extends Controller {
      constructor(logger: LoggerService) {
        super(logger, '/');
      }

      endpoints(): Record<string, RequestHandler> {
        return {
          'GET /': this.endpoint,
        };
      }

      async endpoint(): Promise<Response> {
        const response = Response.noContent();

        response.headers.set('x-test', 'true');

        return response;
      }
    }

    const controller = new c(new MockLoggerService());
    const app = express();

    controller.configure(app);

    const response = await supertest(app).get('/');

    expect(response.headers).toHaveProperty('x-test', 'true');
  });
});
