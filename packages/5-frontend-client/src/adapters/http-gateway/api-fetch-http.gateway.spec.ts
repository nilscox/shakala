import { AuthorizationError, ValidationErrors } from 'frontend-domain';
import { AuthorizationErrorReason } from 'shared';

import { ApiFetchHttpGateway, ApiHttpError } from './api-fetch-http.gateway';
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

  it('handles authorization errors', async () => {
    const headers = new Headers();
    const reason = AuthorizationErrorReason.emailValidationRequired;

    headers.set('Content-Type', 'application/json');

    const json = async () => ({ code: 'Unauthorized', message: "can't touch this", details: { reason } });
    const fetch = mockFetch({ ok: false, status: 403, headers, json });
    const http = new ApiFetchHttpGateway(baseUrl, fetch);

    const error = await expect.rejects(http.write('post', '/')).with(AuthorizationError);

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
    const http = new ApiFetchHttpGateway(baseUrl, fetch);

    const error = await expect.rejects(http.write('post', '/')).with(ValidationErrors);

    expect(error.getFieldError('email')).toEqual('required');
  });

  it('throws an ApiHttpError when the error code is not known', async () => {
    const headers = new Headers();

    headers.set('Content-Type', 'application/json');

    const json = async () => ({
      code: 'SomeErrorCode',
      message: 'some error message',
      details: { some: 'details' },
    });

    const fetch = mockFetch({ ok: false, status: 400, headers, json });
    const http = new ApiFetchHttpGateway(baseUrl, fetch);

    const error = await expect.rejects(http.read('get', '/')).with(ApiHttpError);

    expect(error.code).toEqual('SomeErrorCode');
    expect(error.message).toEqual('some error message');
    expect(error.details).toEqual({ some: 'details' });
  });
});
