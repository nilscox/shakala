import { HttpErrorBody } from 'shared';

export interface Response<Body> {
  readonly ok: boolean;
  readonly status: number;
  readonly headers: Headers;
  readonly body: Body;
  readonly error: unknown;
}

export class HttpError {
  readonly status: number;

  constructor(readonly response: Response<HttpErrorBody>) {
    this.status = response.status;
  }
}

export class UnknownHttpError {
  constructor(readonly response: globalThis.Response, readonly body: unknown) {}
}

export type QueryParams = Record<string, string | number | undefined>;

export interface ReadRequestOptions<Query extends QueryParams> {
  readonly query?: Query;
  readonly onError?: (error: HttpError) => void;
}

export interface WriteRequestOptions<Body, Query extends QueryParams> {
  readonly query?: Query;
  readonly body?: Body;
  readonly onError?: (error: HttpError) => void;
}

export class NetworkError extends Error {
  constructor() {
    super('network error when attempting to fetch resource');
  }
}

export interface HttpGateway {
  get<ResponseBody, Query extends QueryParams = never>(
    path: string,
    options?: ReadRequestOptions<Query>,
  ): Promise<Response<ResponseBody>>;

  post<ResponseBody, RequestBody, Query extends QueryParams = never>(
    path: string,
    options?: WriteRequestOptions<RequestBody, Query>,
  ): Promise<Response<ResponseBody>>;

  put<ResponseBody, RequestBody, Query extends QueryParams = never>(
    path: string,
    options?: WriteRequestOptions<RequestBody, Query>,
  ): Promise<Response<ResponseBody>>;
}
