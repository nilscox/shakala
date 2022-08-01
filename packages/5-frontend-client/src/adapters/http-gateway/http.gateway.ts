export interface Response<Body> {
  readonly ok: boolean;
  readonly status: number;
  readonly headers: Headers;
  readonly body: Body;
  readonly error: unknown;
}

export interface RequestOptions<Body> {
  readonly query?: Record<string, string | number>;
  readonly body?: Body;
}

export class NetworkError extends Error {
  constructor() {
    super('Network error when attempting to fetch resource');
  }
}

export interface HttpGateway {
  get<ResponseBody = unknown>(path: string, options?: RequestOptions<never>): Promise<Response<ResponseBody>>;

  post<RequestBody, ResponseBody = unknown>(
    path: string,
    options?: RequestOptions<RequestBody>,
  ): Promise<Response<ResponseBody>>;

  put<RequestBody, ResponseBody = unknown>(
    path: string,
    options?: RequestOptions<RequestBody>,
  ): Promise<Response<ResponseBody>>;
}
