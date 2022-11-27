import expect, { AssertionFailed, createMatcher } from '@nilscox/expect';
import { RootHookObject } from 'mocha';

import type { StubSnackbarGateway } from './stubs/stub-snackbar-gateway';

/* eslint-disable @typescript-eslint/no-namespace */

declare global {
  namespace Expect {
    export interface Assertions {
      toHaveSuccessMessage(expected: string): void;
      toHaveWarningMessage(expected: string): void;
      toHaveErrorMessage(expected: string): void;
    }
  }
}

const registerAssertions = () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const StubSnackbarGateway = require('./stubs/stub-snackbar-gateway').StubSnackbarGateway;

  const isStubSnackbarGateway = (value: unknown): value is StubSnackbarGateway => {
    return value instanceof StubSnackbarGateway;
  };

  // todo: refactor toHaveMessage(status)
  expect.addCustomAssertion({
    name: 'toHaveSuccessMessage',
    expectedType: 'a StubSnackbarGateway',
    guard: isStubSnackbarGateway,
    assert(snackbarGateway, expected) {
      if (!snackbarGateway.successMessages.some((message) => this.deepEqual(message, expected))) {
        throw new AssertionFailed();
      }
    },
    getMessage(snackbarGateway, expected) {
      return formatMessage(
        'success',
        this.not,
        this.formatValue(expected),
        snackbarGateway.successMessages.map(this.formatValue),
      );
    },
  });

  expect.addCustomAssertion({
    name: 'toHaveWarningMessage',
    expectedType: 'a StubSnackbarGateway',
    guard: isStubSnackbarGateway,
    assert(snackbarGateway, expected) {
      if (!snackbarGateway.warningMessages.some((message) => this.deepEqual(message, expected))) {
        throw new AssertionFailed();
      }
    },
    getMessage(snackbarGateway, expected) {
      return formatMessage(
        'warning',
        this.not,
        this.formatValue(expected),
        snackbarGateway.warningMessages.map(this.formatValue),
      );
    },
  });

  expect.addCustomAssertion({
    name: 'toHaveErrorMessage',
    expectedType: 'a StubSnackbarGateway',
    guard: isStubSnackbarGateway,
    assert(snackbarGateway, expected) {
      if (!snackbarGateway.errorMessages.some((message) => this.deepEqual(message, expected))) {
        throw new AssertionFailed();
      }
    },
    getMessage(snackbarGateway, expected) {
      return formatMessage(
        'error',
        this.not,
        this.formatValue(expected),
        snackbarGateway.errorMessages.map(this.formatValue),
      );
    },
  });

  const formatMessage = (
    type: 'success' | 'warning' | 'error',
    not: boolean,
    expected: string,
    messages: string[],
  ) => {
    let message = 'expected snackbarGateway';

    if (not) {
      message += 'not ';
    }

    message += ` to have ${type} message `;
    message += expected;

    if (messages.length > 0) {
      message += '\n\nmessages:\n';
      message += messages.map((message) => `- ${message}`).join('\n');
    }

    return message;
  };
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
