import { HttpErrorBody, last } from 'shared';

import { HttpError, HttpGateway, ReadRequestOptions, Response, WriteRequestOptions } from './http.gateway';

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

  static created(body: unknown) {
    return this.create({ status: 201, body });
  }

  static noContent() {
    return this.create({ status: 204 });
  }

  static notFound() {
    return this.create<HttpErrorBody>({ status: 404, body: { code: '', message: '' } });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRequestOptions = ReadRequestOptions<any> | WriteRequestOptions<unknown, any>;

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
  delete = this.createRequest('delete');

  private key(method: string, path: string) {
    return [method, path].join(' ');
  }

  private requests = new Array<{ method: string; path: string; options?: AnyRequestOptions }>();

  get lastRequest() {
    return last(this.requests);
  }

  private createRequest(method: string) {
    return async <Body>(path: string, options?: AnyRequestOptions): Promise<Response<Body>> => {
      this.requests.push({ method, path, options });

      const key = this.key(method, path);
      const error = this.errors.get(key);

      if (error) {
        const httpError = new HttpError(error);

        options?.onError?.(httpError);
        throw httpError;
      }

      const response = this.responses.get(key);

      if (!response) {
        throw new HttpError(StubResponse.notFound());
      }

      return response as Response<Body>;
    };
  }
}
