import util from 'node:util';

import { HttpMethod, HttpPort, HttpRequest, HttpResponse, RequestOptions } from './http.port';

export type MockHttpResponse = (response: Partial<HttpResponse>) => void;

export class StubHttpAdapter implements HttpPort {
  private responses = new Map<Partial<HttpRequest>, Partial<HttpResponse>>();

  mock(method: HttpMethod, url: string, options?: { body?: unknown }): MockHttpResponse {
    return (response) => this.responses.set({ method, url, body: options?.body }, response);
  }

  async get<ResponseBody>(
    path: string,
    options?: RequestOptions<ResponseBody>
  ): Promise<HttpResponse<ResponseBody>> {
    return this.request({ method: 'GET', url: path }, options);
  }

  post = this.mutation('POST');
  put = this.mutation('PUT');
  delete = this.mutation('DELETE');

  private mutation(method: HttpMethod) {
    return async <RequestBody, ResponseBody>(
      path: string,
      body?: RequestBody,
      options?: RequestOptions<ResponseBody>
    ): Promise<HttpResponse<ResponseBody>> => {
      return this.request({ method, url: path, body }, options);
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async request(request: HttpRequest, options?: RequestOptions): Promise<HttpResponse<any>> {
    if (options?.search) {
      request.url += `?${new URLSearchParams(options.search as Record<string, string>)}`;
    }

    for (const [match, response] of this.responses.entries()) {
      if (!this.matchRequest(match, request)) {
        continue;
      }

      return {
        status: 200,
        body: undefined,
        headers: new Headers(),
        ...response,
      };
    }

    let message = `no match found for request ${util.inspect(request)}\n`;
    message += Array.from(this.responses.keys()).map((value) => util.inspect(value));

    throw new Error(message);
  }

  private matchRequest(match: Partial<HttpRequest>, request: HttpRequest) {
    const { method, url, body } = match;

    if (method && method !== request.method) {
      return false;
    }

    if (url && url !== request.url) {
      return false;
    }

    if (body && JSON.stringify(body) !== JSON.stringify(request.body)) {
      return false;
    }

    return true;
  }
}
