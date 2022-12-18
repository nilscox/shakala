import { createStubFunction } from 'frontend-domain';

import { FetchHttpGateway } from './fetch-http.gateway';
import { HttpError, NetworkError, Response } from './http.gateway';
import { mockFetch } from './mock-fetch';

describe('FetchHttpGateway', () => {
  const baseUrl = 'https://base.url';

  it('performs a query', async () => {
    const fetch = mockFetch();

    const http = new FetchHttpGateway(baseUrl, fetch);

    await http.read('get', '/path');

    expect(fetch).toHaveBeenCalledWith('https://base.url/path', expect.objectWith({ method: 'GET' }));
  });

  it('returns the response json body', async () => {
    const result = { res: 'ult' };
    const headers = new Headers();

    headers.set('Content-Type', 'application/json');

    const fetch = mockFetch({
      headers,
      async json() {
        return result;
      },
    });

    const http = new FetchHttpGateway(baseUrl, fetch);

    const response = await http.read('get', '/');

    expect(response.body).toBe(result);
  });

  it('returns the response text body', async () => {
    const result = 'result';
    const headers = new Headers();

    headers.set('Content-Type', 'text/plain');

    const fetch = mockFetch({
      headers,
      async text() {
        return result;
      },
    });

    const http = new FetchHttpGateway(baseUrl, fetch);

    const response = await http.read('get', '/');

    expect(response.body).toBe(result);
  });

  it('appends a query string to the URL', async () => {
    const fetch = mockFetch();
    const http = new FetchHttpGateway(baseUrl, fetch);

    await http.read('get', '/', {
      query: { one: 1, two: '2' },
    });

    expect(fetch).toHaveBeenCalledWith('https://base.url/?one=1&two=2', expect.anything());
  });

  it('does not append a question mark to the URL when the query is an empty object', async () => {
    const fetch = mockFetch();
    const http = new FetchHttpGateway(baseUrl, fetch);

    await http.read('get', '/', {
      query: {},
    });

    expect(fetch).toHaveBeenCalledWith('https://base.url/', expect.anything());
  });

  it('performs a mutation', async () => {
    const fetch = mockFetch();
    const http = new FetchHttpGateway(baseUrl, fetch);

    await http.write('post', '/', {
      body: { bo: 'dy' },
    });

    expect(fetch).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectWith({
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: '{"bo":"dy"}',
      }),
    );
  });

  it('sends a body of type FormData', async () => {
    const fetch = mockFetch();
    const http = new FetchHttpGateway(baseUrl, fetch);

    const body = new FormData();

    await http.write('post', '/', {
      body,
    });

    expect(fetch).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectWith({
        method: 'POST',
        body,
      }),
    );
  });

  it('handles network errors', async () => {
    const http = new FetchHttpGateway(baseUrl, (): never => {
      throw new TypeError('fetch failed', { cause: { code: 'ECONNREFUSED' } });
    });

    await expect.rejects(http.read('get', '/')).with(NetworkError);
  });

  it('returns the handled error', async () => {
    const fetch = mockFetch({
      ok: false,
      status: 400,
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: async () => ({ some: 'error' }),
    });

    const http = new FetchHttpGateway(baseUrl, fetch);

    // todo: use default implementation
    const onError = createStubFunction();
    onError.return('result');

    const response = await http.read('get', '/', { onError });

    await expect(onError.lastCall).toEqual([expect.objectWith({ status: 400, body: { some: 'error' } })]);

    await expect(response).toHaveProperty('status', 400);
    await expect(response).toHaveProperty('body', 'result');
  });

  it('HttpError.isHttpError type guard', async () => {
    const error = new HttpError({ status: 404 } as Response);

    expect(HttpError.isHttpError(undefined)).toBe(false);
    expect(HttpError.isHttpError(new Error())).toBe(false);
    expect(HttpError.isHttpError(error)).toBe(true);
    expect(HttpError.isHttpError(error, 400)).toBe(false);
    expect(HttpError.isHttpError(error, 404)).toBe(true);
  });
});
