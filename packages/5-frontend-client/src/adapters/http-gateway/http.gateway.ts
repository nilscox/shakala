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

export interface HttpGateway {
  get<ResponseBody>(path: string, options?: RequestOptions<never>): Promise<Response<ResponseBody>>;

  post<RequestBody, ResponseBody>(
    path: string,
    options?: RequestOptions<RequestBody>,
  ): Promise<Response<ResponseBody>>;
}
