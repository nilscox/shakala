import { HttpError } from './http-error';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
export type SearchParams = Record<string, string | number | boolean | undefined>;

export interface HttpRequest<Body = unknown> {
  url: string;
  method: HttpMethod;
  search?: SearchParams;
  headers?: Headers;
  body?: Body;
}

export interface HttpResponse<Body = unknown> {
  status: number;
  headers: Headers;
  body: Body;
}

export type RequestOptions<ResponseBody = unknown> = {
  search?: SearchParams;
  onError?(error: HttpError): ResponseBody;
};

export interface HttpPort {
  get<ResponseBody = unknown>(
    path: string,
    options?: RequestOptions<ResponseBody>
  ): Promise<HttpResponse<ResponseBody>>;

  post<RequestBody = unknown, ResponseBody = unknown>(
    path: string,
    body?: RequestBody,
    option?: RequestOptions<ResponseBody>
  ): Promise<HttpResponse<ResponseBody>>;

  put<RequestBody = unknown, ResponseBody = unknown>(
    path: string,
    body?: RequestBody,
    option?: RequestOptions<ResponseBody>
  ): Promise<HttpResponse<ResponseBody>>;

  delete<RequestBody = unknown, ResponseBody = unknown>(
    path: string,
    body?: RequestBody,
    option?: RequestOptions<ResponseBody>
  ): Promise<HttpResponse<ResponseBody>>;
}
