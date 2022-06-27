import { Application, Router } from 'express';

import { HttpError } from './http-errors';
import { Request } from './request';
import { RequestAdapter } from './request-adapter';
import { Response } from './response';

export type RequestHandler = (req: Request) => Response | Promise<Response>;
type Method = 'get' | 'post';

export abstract class Controller {
  private router = Router();

  constructor(private readonly prefix: string) {}

  abstract endpoints(): Record<string, RequestHandler>;

  configure(app: Application) {
    app.use(this.prefix, this.router);

    for (const [endpoint, handler] of Object.entries(this.endpoints())) {
      const [verb, path] = endpoint
        .split(' ')
        .map((str) => str.trim())
        .filter(Boolean);

      console.log(verb, this.prefix + path, '->', this.constructor.name + '.' + handler.name + '()');

      if (!verb || !path) {
        throw new Error(`Controller: invalid endpoint "${endpoint}"`);
      }

      this.register(verb.toLowerCase() as Method, path, handler.bind(this));
    }
  }

  register(method: Method, path: string, handler: RequestHandler) {
    this.router[method](path, async (req, res) => {
      const handleResponse = (response: Response) => {
        res.status(response.status);

        if (response.body !== undefined) {
          res.json(response.body);
        } else {
          res.end();
        }
      };

      try {
        handleResponse(await handler(new RequestAdapter(req)));
      } catch (error) {
        if (error instanceof HttpError || error instanceof Response) {
          return handleResponse(error);
        }

        console.error(error);

        if (error instanceof Error) {
          res.status(500).set('Content-Type', 'text/plain').send(error?.stack);
        } else {
          res.status(500).json(error);
        }
      }
    });
  }
}
