export function assert(value: unknown, message?: string): asserts value {
  if (!value) {
    throw new AssertionError(message);
  }
}

class AssertionError extends Error {
  constructor(message = 'Assertion failed') {
    super(message);
  }
}
