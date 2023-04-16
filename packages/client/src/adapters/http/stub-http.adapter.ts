import { assert, removeUndefinedValues } from '@shakala/shared';

import { HttpError } from './http-error';
import { HttpMethod, HttpPort, HttpRequest, HttpResponse, RequestOptions } from './http.port';

export type MockHttpResponse = (response: Partial<HttpResponse>) => void;

export class StubHttpAdapter implements HttpPort {
  readonly requests = new Array<HttpRequest>();
  readonly responses = new Array<Partial<HttpResponse> | Partial<HttpError>>();

  set response(response: Partial<HttpResponse>) {
    this.responses.push(response);
  }

  set error(response: Partial<HttpResponse>) {
    this.responses.push({ status: 500, ...response });
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

    const response = this.getNextResponse();

    if (Math.floor(response.status / 100) !== 2) {
      const error = new HttpError(request, response);

      if (options?.onError) {
        response.body = options.onError(error);
      } else {
        throw error;
      }
    }

    return response;
  }

  private getNextResponse(): HttpResponse<unknown> {
    const response = this.responses.pop();

    assert(response, 'StubHttpAdapter: no next response');

    return {
      status: 200,
      body: undefined,
      headers: new Headers(),
      ...response,
    };
  }
}
