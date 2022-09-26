import { AuthorizationError, LoggerPort } from 'backend-application';
import {
  Application,
  RequestHandler as ExpressRequestHandler,
  Response as ExpressResponse,
  Router,
} from 'express';

import { Forbidden, HttpError } from './http-errors';
import { Request } from './request';
import { RequestAdapter } from './request-adapter';
import { Response } from './response';

export type RequestHandler = (req: Request) => Response | Promise<Response>;
type Method = 'get' | 'post';

interface Endpoint<T> extends TypedPropertyDescriptor<T> {
  middlewares?: ExpressRequestHandler[];
}

export const Middlewares = (...middlewares: ExpressRequestHandler[]): MethodDecorator => {
  return <T>(_target: object, _propertyKey: string | symbol, descriptor: Endpoint<T>) => {
    if (descriptor.value) {
      Reflect.set(descriptor.value, 'middlewares', middlewares);
    }
  };
};

export abstract class Controller {
  private router = Router();

  constructor(private readonly logger: LoggerPort, private readonly prefix = '') {}

  abstract endpoints(): Record<string, RequestHandler>;

  configure(app: Application) {
    app.use(this.prefix, this.router);

    for (const [endpoint, handler] of Object.entries(this.endpoints())) {
      const [verb, path] = endpoint
        .split(' ')
        .map((str) => str.trim())
        .filter(Boolean);

      if (!verb || !path) {
        throw new Error(`Controller: invalid endpoint "${endpoint}"`);
      }

      this.logger.log(`registering endpoint ${[verb, this.prefix + path].join(' ').replace(/\/$/, '')}`);

      const middlewares: ExpressRequestHandler[] = Reflect.get(handler, 'middlewares') ?? [];

      this.register(verb.toLowerCase() as Method, path, middlewares, handler.bind(this));
    }
  }

  register(method: Method, path: string, middlewares: ExpressRequestHandler[], handler: RequestHandler) {
    const expressHandler: ExpressRequestHandler = async (req, res) => {
      const handleResponse = this.createResponseHandler(res);
      const handleError = this.createdErrorHandler(res);

      try {
        handleResponse(await handler(new RequestAdapter(req)));
      } catch (error) {
        handleError(error);
      }
    };

    this.router[method](path, ...middlewares.concat(expressHandler));
  }

  private createResponseHandler(res: ExpressResponse) {
    return (response: Response) => {
      res.status(response.status);

      for (const [key, value] of response.headers) {
        res.set(key, value);
      }

      if (response.body === undefined) {
        res.end();
        return;
      }

      if (typeof response.body === 'string') {
        res.set('Content-Type', 'text/plain');
        res.send(response.body);
      } else if (Buffer.isBuffer(response.body)) {
        res.send(response.body);
      } else {
        res.json(response.body);
      }
    };
  }

  private createdErrorHandler(res: ExpressResponse) {
    const handleResponse = this.createResponseHandler(res);

    return (error: unknown) => {
      if (error instanceof HttpError || error instanceof Response) {
        return handleResponse(error);
      }

      if (error instanceof AuthorizationError) {
        return handleResponse(
          new Forbidden('Unauthorized', 'user does not have the required permission to perform this action', {
            reason: error.details.reason,
          }),
        );
      }

      this.logger.error(error);
      res.status(500);

      if (error instanceof Error) {
        res.set('Content-Type', 'text/plain').send(error?.stack);
      } else {
        res.json(error);
      }
    };
  }
}
