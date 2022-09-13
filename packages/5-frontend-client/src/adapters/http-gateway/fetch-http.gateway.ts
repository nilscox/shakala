import { AuthorizationError, AuthorizationErrorReason, FieldError, ValidationError } from 'frontend-domain';
import { get, isArray, isString, PayloadError } from 'shared';

import {
  HttpGateway,
  NetworkError,
  ReadRequestOptions,
  WriteRequestOptions,
  Response,
  QueryParams,
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

  constructor(private readonly baseUrl: string, private readonly fetch = window.fetch.bind(window)) {}

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
    };

    if (body) {
      requestHeaders.set('Content-Type', 'application/json');
      init.body = JSON.stringify(body);
    }

    const url = this.baseUrl + path + this.getQueryString(query);

    let response: globalThis.Response;

    try {
      response = await this.fetch(url, init);
    } catch (error) {
      this.detectNetworkError(error);
      throw error;
    }

    const responseBody = await this.getResponseBody(response);

    if (this.fakeLag) {
      await new Promise((r) => setTimeout(r, this.fakeLag));
    }

    if (get(responseBody, 'error') === 'ValidationError') {
      throw new ValidationError(this.getInvalidFields(responseBody));
    }

    if (get(responseBody, 'error') === 'Forbidden') {
      throw new AuthorizationError(this.getAuthorizationErrorReason(responseBody));
    }

    return new FetchResponse(response, responseBody as ResponseBody);
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

    if ([chromeErrorMessage, firefoxErrorMessage].includes(message as string)) {
      throw new NetworkError();
    }
  }

  // validate with yup?
  private getInvalidFields(body: unknown) {
    const parseError = new PayloadError('FetchHttpGateway: cannot parse invalid fields', { body });

    const fields = isArray(get(body, 'details', 'fields'))?.map((field): FieldError => {
      const fieldName = isString(get(field, 'field'));
      const error = isString(get(field, 'error'));
      const value = get(field, 'value');

      if (!fieldName || !error) {
        throw parseError;
      }

      return { field: fieldName, error, value };
    });

    if (!fields) {
      throw parseError;
    }

    return fields;
  }

  private getAuthorizationErrorReason(error: unknown) {
    const message = get(error, 'details', 'message');

    if (message === 'authenticated') {
      return AuthorizationErrorReason.authenticated;
    }

    if (message === 'unauthenticated') {
      return AuthorizationErrorReason.unauthenticated;
    }

    if (message === 'EmailNotValidated') {
      return AuthorizationErrorReason.emailValidationRequired;
    }

    if (typeof message === 'string') {
      return message;
    }

    return 'unknown';
  }
}
