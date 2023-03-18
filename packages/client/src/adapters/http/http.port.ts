export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface HttpRequest<Body = unknown> {
  url: string;
  method: HttpMethod;
  search?: URLSearchParams;
  headers?: Headers;
  body?: Body;
}

export interface HttpResponse<Body = unknown> {
  status: number;
  headers: Headers;
  body: Body;
}

export type RequestOptions<ResponseBody = unknown> = {
  search?: Record<string, string | number>;
  onError?(error: HttpError): ResponseBody;
};

export class HttpError extends Error {
  constructor(public readonly request: HttpRequest, public readonly response: HttpResponse) {
    super(`HTTP ${response.status} Error`);
  }
}

export interface HttpPort {
  get<ResponseBody>(
    path: string,
    options?: RequestOptions<ResponseBody>
  ): Promise<HttpResponse<ResponseBody>>;

  post<RequestBody, ResponseBody>(
    path: string,
    body?: RequestBody,
    option?: RequestOptions<ResponseBody>
  ): Promise<HttpResponse<ResponseBody>>;

  put<RequestBody, ResponseBody>(
    path: string,
    body?: RequestBody,
    option?: RequestOptions<ResponseBody>
  ): Promise<HttpResponse<ResponseBody>>;

  delete<RequestBody, ResponseBody>(
    path: string,
    body?: RequestBody,
    option?: RequestOptions<ResponseBody>
  ): Promise<HttpResponse<ResponseBody>>;
}
