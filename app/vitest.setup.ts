import { isResponse } from '@remix-run/server-runtime/responses';

declare global {
  namespace jest {
    interface Matchers<R> {
      toEqualResponse(expected: ExpectResponse): R;
    }
  }
}

type ExpectResponse = {
  status?: number;
  body?: unknown;
};

expect.extend({
  async toEqualResponse(received, expected: ExpectResponse) {
    const { isNot } = this;

    const fail = (message: string) => ({
      pass: false,
      message: () => message,
    });

    if (!isResponse(received)) {
      return fail('received value is not a response');
    }

    if ('status' in expected && received.status !== expected.status) {
      return fail(`expected response to have status ${expected.status}, but it is ${received.status}`);
    }

    if ('body' in expected) {
      const body = await received.json();

      if (!this.equals(expected.body, body)) {
        return fail(this.utils.diff(expected.body, body));
      }
    }

    return {
      pass: !isNot,
      message: () => 'received value matches the expected response',
    };
  },
});
