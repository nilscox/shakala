import { HttpErrorBody } from 'shared';

import { HttpError, HttpGateway, Response } from './http.gateway';

export class StubResponse<Body = unknown> implements Response<Body> {
  get ok() {
    return Math.floor(this.status / 100) !== 2;
  }

  public status = 200;
  public headers = new Headers();
  public error: unknown;

  constructor(public body: Body) {}

  static create<Body>(overrides: Partial<Response<Body>> = {}): StubResponse<Body> {
    return Object.assign(new StubResponse(null), overrides);
  }

  static notFound() {
    return this.create<HttpErrorBody>({ status: 404, body: { code: '', message: '' } });
  }
}

export class StubHttpGateway implements HttpGateway {
  private responses = new Map<string, Response<unknown>>();
  private errors = new Map<string, Response<HttpErrorBody>>();

  for = (method: string, path: string) => ({
    return: (response: Response<unknown>) => {
      this.responses.set(this.key(method, path), response);
    },
    throw: (response: Response<HttpErrorBody>) => {
      this.errors.set(this.key(method, path), response);
    },
  });

  get = this.createRequest('get');
  post = this.createRequest('post');
  put = this.createRequest('put');

  private key(method: string, path: string) {
    return [method, path].join(' ');
  }

  private createRequest(method: string) {
    return async <Body>(path: string): Promise<Response<Body>> => {
      const key = this.key(method, path);
      const error = this.errors.get(key);

      if (error) {
        throw new HttpError(error);
      }

      const response = this.responses.get(key);

      if (!response) {
        throw new HttpError(StubResponse.notFound());
      }

      return response as Response<Body>;
    };
  }
}
