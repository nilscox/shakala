import { AuthorizationError, ValidationErrors } from 'frontend-domain';
import { AuthorizationErrorReason } from 'shared';
import { mockResolve } from 'shared/test';

import { FetchHttpGateway } from './fetch-http.gateway';
import { NetworkError } from './http.gateway';

const mockFetch = (overrides?: Partial<Response>) => {
  return mockResolve<Response>({
    ok: true,
    text() {},
    json() {},
    headers: new Headers(),
    ...overrides,
  } as Response);
};

describe('FetchHttpGateway', () => {
  const baseUrl = 'https://base.url';

  it('performs a query', async () => {
    const fetch = mockFetch();

    const http = new FetchHttpGateway(baseUrl, fetch);

    await http.get('/path');

    expect(fetch).toHaveBeenCalledWith('https://base.url/path', expect.objectWith({ method: 'GET' }));
  });

  it('adds credentials and cache parameters when calling fetch', async () => {
    const fetch = mockFetch();

    const http = new FetchHttpGateway(baseUrl, fetch);

    await http.get('/path');

    expect(fetch).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectWith({
        credentials: 'include',
        cache: 'no-store',
      }),
    );
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

    const response = await http.get('/');

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

    const response = await http.get('/');

    expect(response.body).toBe(result);
  });

  it('appends a query string to the URL', async () => {
    const fetch = mockFetch();
    const http = new FetchHttpGateway(baseUrl, fetch);

    await http.get('/', {
      query: { one: 1, two: '2' },
    });

    expect(fetch).toHaveBeenCalledWith('https://base.url/?one=1&two=2', expect.anything());
  });

  it('does not append a question mark to the URL when the query is an empty object', async () => {
    const fetch = mockFetch();
    const http = new FetchHttpGateway(baseUrl, fetch);

    await http.get('/', {
      query: {},
    });

    expect(fetch).toHaveBeenCalledWith('https://base.url/', expect.anything());
  });

  it('performs a mutation', async () => {
    const fetch = mockFetch();
    const http = new FetchHttpGateway(baseUrl, fetch);

    await http.post('/', {
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

    await http.post('/', {
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

  it('handles authorization errors', async () => {
    const headers = new Headers();
    const reason = AuthorizationErrorReason.emailValidationRequired;

    headers.set('Content-Type', 'application/json');

    const json = async () => ({ code: 'Unauthorized', message: "can't touch this", details: { reason } });
    const fetch = mockFetch({ ok: false, status: 403, headers, json });
    const http = new FetchHttpGateway(baseUrl, fetch);

    const error = await expect.rejects(http.post('/')).with(AuthorizationError);

    expect(error).toHaveProperty('reason', reason);
  });

  it('handles validation errors', async () => {
    const headers = new Headers();

    headers.set('Content-Type', 'application/json');

    const fields = [
      { field: 'email', error: 'required', value: 'some@email.tld' },
      { field: 'nick', error: 'already-exists', value: 'nick' },
    ];

    const json = async () => ({ code: 'ValidationError', message: 'validation error', details: { fields } });
    const fetch = mockFetch({ ok: false, status: 400, headers, json });
    const http = new FetchHttpGateway(baseUrl, fetch);

    const error = await expect.rejects(http.post('/')).with(ValidationErrors);

    expect(error.getFieldError('email')).toEqual('required');
  });

  it('handles network errors', async () => {
    const http = new FetchHttpGateway(baseUrl, (): never => {
      throw new TypeError('fetch failed', { cause: { code: 'ECONNREFUSED' } });
    });

    await expect.rejects(http.post('/')).with(NetworkError);
  });
});
