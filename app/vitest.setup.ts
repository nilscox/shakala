import { isResponse } from '@remix-run/server-runtime/responses';

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveStatus(expected: number): R;
      toHaveHeader(key: string, value?: string): R;
    }
  }
}

const pass = () => ({
  pass: true,
  message: () => 'ok',
});

const fail = (message: string) => ({
  pass: false,
  message: () => message,
});

expect.extend({
  toHaveStatus(received, expected: number) {
    if (!isResponse(received)) {
      return fail('received value is not a response');
    }

    return {
      pass: received.status === expected,
      message: () => `expected response to have status ${expected} but it is ${received.status}`,
    };
  },
});

expect.extend({
  toHaveHeader(received, key: string, value?: string) {
    if (!isResponse(received)) {
      return fail('received value is not a response');
    }

    if (!received.headers.has(key)) {
      return fail(`response does not have a "${key}" header`);
    }

    const actual = received.headers.get(key);

    if (value === undefined) {
      return pass();
    }

    return {
      pass: actual === value,
      message: () => `expected response header ${key} to be ${value} but it is ${actual}`,
    };
  },
});
