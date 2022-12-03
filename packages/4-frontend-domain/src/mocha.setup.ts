import expect, { AssertionFailed, createMatcher } from '@nilscox/expect';
import { RootHookObject } from 'mocha';

import type { StubSnackbarGateway } from './stubs/stub-snackbar-gateway';

/* eslint-disable @typescript-eslint/no-namespace */

type SnackType = 'success' | 'warning' | 'error';

declare global {
  namespace Expect {
    export interface Assertions {
      toHaveSnack(type: SnackType, expected: string): void;
    }
  }
}

const registerAssertions = () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const StubSnackbarGateway = require('./stubs/stub-snackbar-gateway').StubSnackbarGateway;

  const isStubSnackbarGateway = (value: unknown): value is StubSnackbarGateway => {
    return value instanceof StubSnackbarGateway;
  };

  expect.addCustomAssertion({
    name: 'toHaveSnack',
    expectedType: 'a StubSnackbarGateway',
    guard: isStubSnackbarGateway,
    assert(snackbarGateway, type, expected) {
      const messages = getMessages(snackbarGateway, type);

      if (!messages.some((message) => this.deepEqual(message, expected))) {
        throw new AssertionFailed();
      }
    },
    getMessage(snackbarGateway, type, expected) {
      const messages = getMessages(snackbarGateway, type);
      let message = 'expected snackbarGateway';

      if (this.not) {
        message += 'not ';
      }

      message += ` to have ${type} message `;
      message += expected;

      if (messages.length > 0) {
        message += '\n\nmessages:\n';
        message += messages.map((message) => `- ${this.formatValue(message)}`).join('\n');
      }

      return message;
    },
  });

  const getMessages = (snackbarGateway: StubSnackbarGateway, type: SnackType) => {
    return {
      success: snackbarGateway.successMessages,
      warning: snackbarGateway.warningMessages,
      error: snackbarGateway.errorMessages,
    }[type];
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
