import { ValidationError } from 'frontend-domain';
import { get } from 'shared';

import { HttpGateway, RequestOptions, Response } from './http.gateway';

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
  constructor(private readonly baseUrl: string, private readonly fetch = window.fetch.bind(window)) {}

  async get<ResponseBody>(path: string, options?: RequestOptions<never>): Promise<Response<ResponseBody>> {
    return this.request('GET', path, options);
  }

  async post<RequestBody, ResponseBody>(
    path: string,
    options?: RequestOptions<RequestBody>,
  ): Promise<Response<ResponseBody>> {
    return this.request('POST', path, options);
  }

  private async request<RequestBody, ResponseBody>(
    method: string,
    path: string,
    options: RequestOptions<RequestBody> = {},
  ): Promise<Response<ResponseBody>> {
    const { query, body } = options;

    const requestHeaders = new Headers();
    const init: RequestInit = {
      method,
      headers: requestHeaders,
      credentials: 'include',
    };

    if (body) {
      requestHeaders.set('Content-Type', 'application/json');
      init.body = JSON.stringify(body);
    }

    const searchParams = new URLSearchParams(query as Record<string, string>);
    const url = this.baseUrl + path + (query ? '?' + searchParams.toString() : '');

    const response = await this.fetch(url, init);
    const responseBody = await this.getResponseBody(response);

    if (get(responseBody, 'error') === 'ValidationError') {
      throw new ValidationError(responseBody.details.fields);
    }

    return new FetchResponse(response, responseBody);
  }

  private async getResponseBody(response: globalThis.Response) {
    const contentType = response.headers.get('Content-Type');

    if (contentType?.startsWith('application/json')) {
      return response.json();
    }

    if (contentType?.startsWith('text/')) {
      return response.text();
    }
  }
}
