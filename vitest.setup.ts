import { expect } from 'vitest';

import { Response } from './packages/3-backend-infrastructure/src/infrastructure';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      test(cb: (received: any) => void): R;
      toHaveStatus(status: number): R;
      toHaveBody(body: unknown): R;
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
  test(received: any, cb: (received: any) => void) {
    cb(received);
    return pass();
  },
});

expect.extend({
  toHaveStatus(received, expected: number) {
    if (!Response.isResponse(received)) {
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
    if (!Response.isResponse(received)) {
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

expect.extend({
  toHaveBody(received, expected: unknown) {
    if (!Response.isResponse(received)) {
      return fail('received value is not a response');
    }

    const { body } = received;

    if (!this.equals(body, expected)) {
      return fail('response body does not match the expected value\n' + this.utils.diff(expected, body));
    }

    return pass();
  },
});

export default {};
