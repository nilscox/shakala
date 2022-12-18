export interface Response<Body = unknown> {
  readonly ok: boolean;
  readonly status: number;
  readonly headers: Headers;
  readonly body: Body;
}

export class HttpError<Body = unknown> extends Error {
  constructor(readonly response: Response<Body>) {
    super(`http ${response.status} error`);
  }

  get status() {
    return this.response.status;
  }

  get body() {
    return this.response.body;
  }

  static isHttpError(error: unknown, status?: number): error is HttpError<unknown> {
    if (!(error instanceof HttpError)) {
      return false;
    }

    if (status === undefined) {
      return true;
    }

    return error.response.status === status;
  }
}

export class NetworkError extends Error {
  constructor() {
    super('network error');
  }
}

export type QueryParams = Record<string, string | number | undefined>;

export interface ReadRequestOptions<ResponseBody, Query extends QueryParams> {
  readonly query?: Query;
  readonly onError?: (error: HttpError) => ResponseBody;
}

export interface WriteRequestOptions<RequestBody, ResponseBody, Query extends QueryParams> {
  readonly query?: Query;
  readonly body?: RequestBody;
  readonly onError?: (error: HttpError) => ResponseBody;
}

export interface HttpGateway {
  read<ResponseBody, Query extends QueryParams = never>(
    method: 'get',
    path: string,
    options?: ReadRequestOptions<ResponseBody, Query>,
  ): Promise<Response<ResponseBody>>;

  write<ResponseBody, RequestBody, Query extends QueryParams = never>(
    method: 'post' | 'put' | 'delete',
    path: string,
    options?: WriteRequestOptions<RequestBody, ResponseBody, Query>,
  ): Promise<Response<ResponseBody>>;
}
