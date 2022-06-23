import { ValidationError } from 'frontend-domain';

import { FetchHttpGateway } from './fetch-http.gateway';

import 'shared/src/vitest.setup';

const mockFetch = (overrides?: Partial<Response>) => {
  return vi.fn<Parameters<typeof fetch>, ReturnType<typeof fetch>>(
    async () =>
      ({
        ok: true,
        text() {},
        json() {},
        headers: new Headers(),
        ...overrides,
      } as Response),
  );
};

describe('FetchHttpGateway', () => {
  const baseUrl = 'https://base.url';

  it('performs a query', async () => {
    const fetch = mockFetch();

    const http = new FetchHttpGateway(baseUrl, fetch);

    await http.get('/path');

    expect(fetch).toHaveBeenCalledWith('https://base.url/path', {
      method: 'GET',
      headers: expect.anything(),
      credentials: 'include',
    });
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

  it('performs a mutation', async () => {
    const fetch = mockFetch();
    const http = new FetchHttpGateway(baseUrl, fetch);

    await http.post('/', {
      body: { bo: 'dy' },
    });

    expect(fetch).toHaveBeenCalledWith(expect.anything(), {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: '{"bo":"dy"}',
      credentials: 'include',
    });
  });

  it('handles validation errors', async () => {
    const headers = new Headers();

    headers.set('Content-Type', 'application/json');

    const fields = [
      { field: 'email', error: 'required' },
      { field: 'nick', error: 'already-exists' },
    ];

    const json = async () => ({ error: 'ValidationError', details: { fields } });
    const fetch = mockFetch({ ok: false, status: 400, headers, json });
    const http = new FetchHttpGateway(baseUrl, fetch);

    await expect(http.post('/')).rejects.test((error: ValidationError) => {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error).toHaveProperty('fields', fields);
    });
  });
});
