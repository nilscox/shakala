import expect, { AssertionFailed, createMatcher } from '@nilscox/expect';
import { RootHookObject } from 'mocha';

import { Response } from './src/infrastructure';

/* eslint-disable @typescript-eslint/no-namespace */

declare global {
  namespace Expect {
    export interface Assertions {
      toHaveStatus(expected: number): void;
      toHaveHeader(header: string, value?: string): void;
      toHaveBody(expected: unknown): void;
    }
  }
}

// todo: handle "not" in error messages

const registerAssertions = () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Response = require('./src/infrastructure').Response;

  const isResponse: (value: unknown) => value is Response = Response.isResponse;

  expect.addCustomAssertion({
    name: 'toHaveStatus',
    expectedType: 'a Response',
    guard: isResponse,
    assert(response, expected) {
      if (response.status !== expected) {
        throw new AssertionFailed();
      }
    },
    getMessage(response, expected) {
      return [
        'expected response to have status',
        this.formatValue(expected),
        'but it is',
        this.formatValue(response.status),
      ].join(' ');
    },
  });

  const formatHeaders = (headers: Map<string, string>) => {
    return Array.from(headers.entries())
      .map((entry) => entry.join(': '))
      .join('\n');
  };

  expect.addCustomAssertion({
    name: 'toHaveHeader',
    expectedType: 'a Response',
    guard: isResponse,
    assert(response, header, value) {
      const actual = response.headers.get(header);
      const error = new AssertionFailed({ actual, expected: value });

      if (!response.headers.has(header)) {
        throw error;
      }

      if (value !== undefined && actual !== value) {
        throw error;
      }
    },
    getMessage(response, header, expectedValue) {
      const actualValue = this.error?.meta;
      let message = `expected response to have header ${this.formatValue(header)}`;

      if (expectedValue) {
        message += ` with value ${this.formatValue(expectedValue)}`;

        if (actualValue) {
          message += ` but it is ${this.formatValue(actualValue)}`;
        }
      }

      return [message, formatHeaders(response.headers)].join('\n\n');
    },
  });

  expect.addCustomAssertion({
    name: 'toHaveBody',
    expectedType: 'a Response',
    guard: isResponse,
    assert(response, expected) {
      if (!this.deepEqual(response.body, expected)) {
        throw new AssertionFailed();
      }
    },
    getMessage(response, expected) {
      return [
        'expected response to have body',
        this.formatValue(expected),
        'but it is',
        this.formatValue(response.body),
      ].join(' ');
    },
  });
};

declare global {
  namespace Expect {
    export interface CustomMatchers {
      objectWithId: typeof objectWithId;
    }
  }
}

const objectWithId = createMatcher((value: Record<'id', string>, id: string) => {
  try {
    expect(value).toEqual(expect.objectWith({ id }));
    return true;
  } catch {
    return false;
  }
});

const registerMatchers = () => {
  expect.addCustomMatcher('objectWithId', objectWithId);
};

export const mochaHooks: RootHookObject = {
  beforeAll() {
    registerAssertions();
    registerMatchers();
  },
  afterAll() {
    expect.cleanup();
  },
};
