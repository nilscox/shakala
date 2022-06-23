import { expect } from 'vitest';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
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
  test(received: any, cb: (received: any) => void) {
    cb(received);
    return pass();
  },
});
