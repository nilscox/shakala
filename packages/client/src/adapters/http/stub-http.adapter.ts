import util from 'node:util';

import { removeUndefinedValues } from '@shakala/shared';

import { HttpError } from './http-error';
import { HttpMethod, HttpPort, HttpRequest, HttpResponse, RequestOptions } from './http.port';

export type MockHttpResponse = (response: Partial<HttpResponse>) => void;

export class StubHttpAdapter implements HttpPort {
  readonly requests = new Array<HttpRequest>();
  readonly responses = new Array<Partial<HttpResponse> | Partial<HttpError>>();

  set response(response: Partial<HttpResponse>) {
    this.responses.push(response);
  }

  set error(error: Partial<HttpError>) {
    this.responses.push(error);
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
    this.requests.push(
      removeUndefinedValues({
        search: options?.search,
        ...request,
      })
    );

    const response: HttpResponse = {
      status: 200,
      body: undefined,
      headers: new Headers(),
    };

    const result = this.responses.pop();

    if (!result) {
      throw new Error(`StubHttpAdapter: no response for request ${util.inspect(request)}`);
    }

    if (result instanceof HttpError) {
      if (options?.onError) {
        response.body = options.onError(result);
      } else {
        throw result;
      }
    }

    return {
      ...response,
      ...result,
    };
  }
}
