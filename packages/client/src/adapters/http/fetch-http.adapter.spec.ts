import expect from '@nilscox/expect';
import { stub } from '@shakala/shared';
import { describe, it } from 'vitest';

import { ValidationErrors } from '~/utils/validation-errors';

import { FetchHttpAdapter } from './fetch-http.adapter';
import { HttpError } from './http-error';

const mockFetch = (overrides?: Partial<Response>) => {
  const response = {
    ok: true,
    status: 200,
    text() {},
    json() {},
    headers: new Headers(),
    ...overrides,
  } as Response;

  return stub<typeof fetch>(() => Promise.resolve(response));
};

describe('FetchHttpAdapter', () => {
  it('performs a GET http request', async () => {
    const fetch = mockFetch({ status: 200 });
    const adapter = new FetchHttpAdapter(undefined, fetch);

    const response = await adapter.get('/');

    expect(fetch.lastCall).toEqual(['/', expect.objectWith({ method: 'GET' })]);
    expect(response.status).toEqual(200);
  });

  it('performs an http request on a specific base url', async () => {
    const fetch = mockFetch();
    const adapter = new FetchHttpAdapter('https://base.url', fetch);

    await adapter.get('/endpoint');

    expect(fetch.lastCall).toEqual(['https://base.url/endpoint', expect.anything()]);
  });

  it('performs an http request with url parameters', async () => {
    const fetch = mockFetch();
    const adapter = new FetchHttpAdapter(undefined, fetch);

    await adapter.get('/', { search: { id: 42, toto: undefined } });

    expect(fetch.lastCall).toEqual(['/?id=42', expect.anything()]);
  });

  it("returns the response's text body", async () => {
    const fetch = mockFetch({ text: () => Promise.resolve('text') });
    const adapter = new FetchHttpAdapter(undefined, fetch);

    const response = await adapter.get('/', { search: { id: 42 } });

    expect(response.body).toEqual('text');
  });

  it("returns the response's json body", async () => {
    const fetch = mockFetch({
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: () => Promise.resolve({ id: 42 }),
    });

    const adapter = new FetchHttpAdapter(undefined, fetch);

    const response = await adapter.get('/', { search: { id: 42 } });

    expect(response.body).toEqual({ id: 42 });
  });

  it('performs a POST http request', async () => {
    const fetch = mockFetch();
    const adapter = new FetchHttpAdapter(undefined, fetch);

    await adapter.post('/', { id: 42 });

    expect(fetch.lastCall).toEqual([
      '/',
      expect.objectWith({
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: '{"id":42}',
      }),
    ]);
  });

  it('throws an HttpError when the request failed', async () => {
    const fetch = mockFetch({ ok: false, status: 401 });
    const adapter = new FetchHttpAdapter(undefined, fetch);

    const error = await expect(adapter.get('/')).toRejectWith(HttpError);

    expect(error).toHaveProperty('request', {
      url: '/',
      method: 'GET',
    });

    expect(error).toHaveProperty('response', {
      status: 401,
      body: undefined,
      headers: new Headers(),
    });
  });

  it('throws a ValidationError when the request fails with a validation error', async () => {
    const body = {
      code: 'ValidationError',
      fields: [{ path: 'field', type: 'min' }],
    };

    const headers = new Headers({ 'Content-Type': 'application/json' });

    const fetch = mockFetch({ ok: false, status: 400, headers, json: async () => body });
    const adapter = new FetchHttpAdapter(undefined, fetch);

    const error = await expect(adapter.get('/')).toRejectWith(ValidationErrors);

    expect(error).toHaveProperty('fieldErrors', {
      field: 'min',
    });
  });

  it('calls the onError effect when the request fails', async () => {
    const fetch = mockFetch({ ok: false });
    const onError = stub(() => 'result');
    const adapter = new FetchHttpAdapter(undefined, fetch);

    const response = await expect(adapter.get('/', { onError })).toResolve();

    expect(response.body).toEqual('result');
  });

  it('performs an HTTP request with a token', async () => {
    const fetch = mockFetch();
    const adapter = new FetchHttpAdapter(undefined, fetch);

    adapter.setToken('value');

    await expect(adapter.get('/')).toResolve();

    const headers = fetch.lastCall?.[1]?.headers;

    expect.assert(headers instanceof Headers);
    expect(headers.get('cookie')).toEqual('token=value');
  });
});
