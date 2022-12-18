import { mockResolve } from 'shared/test';

export const mockFetch = (overrides?: Partial<Response>) => {
  return mockResolve<Response>({
    ok: true,
    text() {},
    json() {},
    headers: new Headers(),
    ...overrides,
  } as Response);
};
