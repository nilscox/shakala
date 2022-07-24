import { expect } from 'vitest';

Error.stackTraceLimit = 100;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      test(cb: (received: any) => void): R;
    }
  }
}

export const pass = () => ({
  pass: true,
  message: () => 'ok',
});

export const fail = (message: string) => ({
  pass: false,
  message: () => message,
});

expect.extend({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  test(received: any, cb: (received: any) => void) {
    cb(received);
    return pass();
  },
});
