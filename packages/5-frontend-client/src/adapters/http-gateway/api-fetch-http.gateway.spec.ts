import { ValidationErrors } from 'frontend-domain';

import { HttpError } from '~/adapters/http-gateway/http.gateway';

import { ApiFetchHttpGateway } from './api-fetch-http.gateway';
import { mockFetch } from './mock-fetch';

describe('ApiFetchHttpGateway', () => {
  const baseUrl = 'https://base.url';

  it('adds credentials and cache parameters when calling fetch', async () => {
    const fetch = mockFetch();

    const http = new ApiFetchHttpGateway(baseUrl, fetch);

    await http.read('get', '/path');

    expect(fetch).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectWith({
        credentials: 'include',
        cache: 'no-store',
      }),
    );
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
    const http = new ApiFetchHttpGateway(baseUrl, fetch);

    const error = await expect.rejects(http.write('post', '/')).with(ValidationErrors);

    expect(error.getFieldError('email')).toEqual('required');
  });

  it('throws an HttpError when the error code is not known', async () => {
    const headers = new Headers();

    headers.set('Content-Type', 'application/json');

    const json = async () => ({
      code: 'SomeErrorCode',
      message: 'some error message',
      details: { some: 'details' },
    });

    const fetch = mockFetch({ ok: false, status: 400, headers, json });
    const http = new ApiFetchHttpGateway(baseUrl, fetch);

    const error = await expect.rejects(http.read('get', '/')).with(HttpError);

    expect(error.body).toEqual({
      code: 'SomeErrorCode',
      message: 'some error message',
      details: { some: 'details' },
    });
  });
});
