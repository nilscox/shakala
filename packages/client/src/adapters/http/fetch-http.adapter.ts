import { wait } from '@shakala/shared';
import { injected } from 'brandi';

import { TOKENS } from '~/app/tokens';
import { ValidationErrors } from '~/utils/validation-errors';

import { AppConfig } from '../config/app-config';

import { HttpError } from './http-error';
import { HttpMethod, HttpPort, HttpRequest, HttpResponse, RequestOptions } from './http.port';

export class FetchHttpAdapter implements HttpPort {
  public delay?: number;
  public headers = new Headers();

  constructor(
    private readonly baseUrl?: string,
    private readonly fetch = globalThis.fetch.bind(globalThis)
  ) {}

  clone() {
    const clone = new FetchHttpAdapter(this.baseUrl, this.fetch);

    clone.delay = this.delay;
    clone.headers = new Headers(this.headers);

    return clone;
  }

  setToken(token: string) {
    this.headers.set('cookie', `token=${token}`);
  }

  async get<ResponseBody>(
    path: string,
    options?: RequestOptions<ResponseBody>
  ): Promise<HttpResponse<ResponseBody>> {
    return this.request({ url: path, method: 'GET' }, options);
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
      return this.request({ url: path, method, body }, options);
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async request(request: HttpRequest, options?: RequestOptions): Promise<HttpResponse<any>> {
    const headers = new Headers(this.headers);

    const init: RequestInit = {
      method: request.method,
      headers,
    };

    if (request.body) {
      headers.set('Content-Type', 'application/json');
      init.body = JSON.stringify(request.body);
    }

    let url = (this.baseUrl ?? '') + request.url;

    if (options?.search) {
      const params = new URLSearchParams();

      for (const [key, value] of Object.entries(options.search)) {
        if (value !== undefined) {
          params.set(key, String(value));
        }
      }

      if (Array.from(params.keys()).length > 0) {
        url += `?${params}`;
      }
    }

    const fetchResponse = await this.fetch(url, init);
    await wait(this.delay ?? 0);

    const response: HttpResponse = {
      status: fetchResponse.status,
      headers: fetchResponse.headers,
      body: undefined,
    };

    if (response.headers.get('Content-Type')?.startsWith('application/json')) {
      response.body = await fetchResponse.json();
    } else {
      response.body = await fetchResponse.text();
    }

    if (!fetchResponse.ok) {
      const error = new HttpError(request, response);

      if (options?.onError) {
        response.body = options.onError(error);
      } else {
        const validationError = ValidationErrors.from(error.response);

        if (validationError) {
          throw validationError;
        }

        throw error;
      }
    }

    return response;
  }
}

export class ApiFetchHttpAdapter extends FetchHttpAdapter {
  constructor(config: AppConfig) {
    super(config.apiBaseUrl);
  }
}

injected(ApiFetchHttpAdapter, TOKENS.config);
