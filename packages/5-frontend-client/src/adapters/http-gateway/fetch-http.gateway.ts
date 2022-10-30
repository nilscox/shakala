import { AuthorizationError, ValidationError } from 'frontend-domain';
import { contains, get, HttpErrorBody, wait } from 'shared';
import * as yup from 'yup';

import {
  HttpError,
  HttpGateway,
  NetworkError,
  QueryParams,
  ReadRequestOptions,
  Response,
  UnknownHttpError,
  WriteRequestOptions,
} from './http.gateway';

const httpErrorSchema = yup.object({
  code: yup.string().required(),
  message: yup.string().required(),
  details: yup.object().optional(),
});

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
  public cookie?: string | null;

  constructor(
    private readonly baseUrl: string,
    private readonly _fetch = typeof window === 'undefined' ? fetch : fetch.bind(window),
  ) {}

  async get<ResponseBody, Query extends QueryParams = never>(
    path: string,
    options?: ReadRequestOptions<Query>,
  ): Promise<Response<ResponseBody>> {
    return this.request('GET', path, options);
  }

  async post<RequestBody, ResponseBody, Query extends QueryParams = never>(
    path: string,
    options?: WriteRequestOptions<RequestBody, Query>,
  ): Promise<Response<ResponseBody>> {
    return this.request('POST', path, options);
  }

  async put<RequestBody, ResponseBody, Query extends QueryParams = never>(
    path: string,
    options?: WriteRequestOptions<RequestBody, Query>,
  ): Promise<Response<ResponseBody>> {
    return this.request('PUT', path, options);
  }

  private async request<RequestBody, ResponseBody, Query extends QueryParams>(
    method: string,
    path: string,
    options: WriteRequestOptions<RequestBody, Query> = {},
  ): Promise<Response<ResponseBody>> {
    const { query, body } = options;

    const requestHeaders = new Headers();
    const init: RequestInit = {
      method,
      headers: requestHeaders,
      credentials: 'include',
      cache: 'no-store',
    };

    if (this.cookie) {
      requestHeaders.set('Cookie', this.cookie);
    }

    if (body) {
      if (body instanceof FormData) {
        init.body = body;
      } else {
        requestHeaders.set('Content-Type', 'application/json');
        init.body = JSON.stringify(body);
      }
    }

    const url = this.baseUrl + path + this.getQueryString(query);

    let response: globalThis.Response;

    try {
      response = await this._fetch(url, init);
    } catch (error) {
      this.detectNetworkError(error);
      throw error;
    }

    const responseBody = await this.getResponseBody(response);

    if (this.fakeLag) {
      await wait(this.fakeLag);
    }

    if (response.ok) {
      return new FetchResponse(response, responseBody as ResponseBody);
    }

    const errorBody = this.parseErrorBody(responseBody);

    if (!errorBody) {
      throw new UnknownHttpError(response, responseBody);
    }

    if (errorBody?.code === 'Unauthorized') {
      throw AuthorizationError.from(errorBody);
    }

    if (errorBody?.code === 'ValidationError') {
      throw ValidationError.from(errorBody);
    }

    const httpError = new HttpError(new FetchResponse<HttpErrorBody>(response, errorBody));

    if (options.onError) {
      options.onError(httpError);
    }

    throw httpError;
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
    const message = get(error, 'message');

    const chromeErrorMessage = 'Failed to fetch';
    const firefoxErrorMessage = 'NetworkError when attempting to fetch resource.';

    if (contains([chromeErrorMessage, firefoxErrorMessage], message)) {
      throw new NetworkError();
    }
  }

  private parseErrorBody(body: unknown): HttpErrorBody | undefined {
    try {
      return httpErrorSchema.validateSync(body);
    } catch (error) {
      return undefined;
    }
  }
}
