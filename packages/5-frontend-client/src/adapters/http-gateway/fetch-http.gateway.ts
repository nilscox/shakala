import { BaseError, get, wait } from 'shared';

import {
  HttpError,
  HttpGateway,
  NetworkError,
  QueryParams,
  ReadRequestOptions,
  Response,
  WriteRequestOptions,
} from './http.gateway';

class FetchResponse<Body> implements Response<Body> {
  constructor(private readonly response: globalThis.Response, public readonly body: Body) {}

  get ok(): boolean {
    return this.response.ok;
  }

  get status(): number {
    return this.response.status;
  }

  get headers(): Headers {
    return this.response.headers;
  }

  get error(): unknown {
    if (this.ok) {
      return;
    }

    return this.body;
  }
}

export class FetchHttpGateway implements HttpGateway {
  public fakeLag?: number;
  public cookie?: string;

  constructor(
    private readonly baseUrl: string,
    private readonly _fetch = typeof window === 'undefined' ? fetch : fetch.bind(window),
  ) {}

  async read<ResponseBody, Query extends QueryParams = never>(
    method: 'get',
    path: string,
    options?: ReadRequestOptions<ResponseBody, Query>,
  ): Promise<Response<ResponseBody>> {
    return this.request(method, path, options);
  }

  async write<RequestBody, ResponseBody, Query extends QueryParams = never>(
    method: 'post' | 'put' | 'delete',
    path: string,
    options?: WriteRequestOptions<RequestBody, ResponseBody, Query>,
  ): Promise<Response<ResponseBody>> {
    return this.request(method, path, options);
  }

  protected async request<RequestBody, ResponseBody, Query extends QueryParams>(
    method: string,
    path: string,
    options: WriteRequestOptions<RequestBody, ResponseBody, Query> = {},
  ): Promise<Response<ResponseBody>> {
    const init = this.getRequestInit(method, options);
    const url = this.getUrl(path, options);

    let fetchResponse: globalThis.Response;

    try {
      fetchResponse = await this._fetch(url, init);
    } catch (error) {
      this.detectNetworkError(error);
      throw error;
    }

    const responseBody = await this.getResponseBody(fetchResponse);

    if (this.fakeLag) {
      await wait(this.fakeLag);
    }

    const response = new FetchResponse(fetchResponse, responseBody);

    if (fetchResponse.ok) {
      return response as Response<ResponseBody>;
    }

    const error = this.getError(response);

    if (options.onError) {
      return new FetchResponse(fetchResponse, options.onError(error));
    }

    throw error;
  }

  protected getRequestInit<RequestBody, ResponseBody, Query extends QueryParams>(
    method: string,
    options: WriteRequestOptions<RequestBody, ResponseBody, Query>,
  ): RequestInit {
    const { body } = options;

    const headers = new Headers();
    const init: RequestInit = {
      method: method.toUpperCase(),
      headers,
    };

    if (this.cookie) {
      headers.set('Cookie', this.cookie);
    }

    if (body) {
      if (body instanceof FormData) {
        init.body = body;
      } else {
        headers.set('Content-Type', 'application/json');
        init.body = JSON.stringify(body);
      }
    }

    return init;
  }

  protected getUrl<RequestBody, ResponseBody, Query extends QueryParams>(
    path: string,
    options: WriteRequestOptions<RequestBody, ResponseBody, Query>,
  ) {
    return this.baseUrl + path + this.getQueryString(options.query);
  }

  private getQueryString(query: QueryParams | undefined): string {
    if (!query || Object.keys(query).length === 0) {
      return '';
    }

    return '?' + new URLSearchParams(query as Record<string, string>).toString();
  }

  private async getResponseBody(response: globalThis.Response): Promise<unknown> {
    const contentType = response.headers.get('Content-Type');

    if (contentType?.startsWith('application/json')) {
      return response.json();
    }

    if (contentType?.startsWith('text/')) {
      return response.text();
    }
  }

  private detectNetworkError(error: unknown) {
    if (error instanceof TypeError && get(error.cause, 'code') === 'ECONNREFUSED') {
      throw new NetworkError();
    }
  }

  protected getError(response: Response): BaseError<unknown> | HttpError {
    return new HttpError(response);
  }
}
