import expect, { AssertionFailed } from '@nilscox/expect';
import { DomainEvent } from 'backend-domain';
import { RootHookObject } from 'mocha';

import { type StubEventBus } from './adapters';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyClass = { new (...args: any[]): any };

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Expect {
    export interface Assertions {
      toBeInstanceOf(Class: AnyClass): void;
      toHaveEmitted(event: DomainEvent): void;
    }
  }
}

export const mochaHooks: RootHookObject = {
  beforeAll() {
    expect.addCustomAssertion({
      name: 'toBeInstanceOf',
      assert(actual, Class) {
        if (!(actual instanceof Class)) {
          throw new AssertionFailed();
        }
      },
      getMessage(actual, Class) {
        let message = `expected ${this.formatValue(actual)}`;

        if (this.not) {
          message += ' not';
        }

        message += ` to be an instance of ${Class.name}`;

        if (this.not) {
          message += ' but it is';
        } else {
          message += ' but it is not';
        }

        return message;
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { StubEventBus } = require('./adapters');

    expect.addCustomAssertion({
      name: 'toHaveEmitted',

      expectedType: 'an instance of StubEventBus',
      guard(actual): actual is StubEventBus {
        return actual instanceof StubEventBus;
      },

      assert(eventBus, event) {
        for (const actual of eventBus.events) {
          if (actual.constructor === event.constructor && this.deepEqual(actual, event)) {
            return;
          }
        }

        throw new AssertionFailed();
      },
      getMessage(eventBus, event) {
        let message = `expected event ${this.formatValue(event)}`;

        if (this.not) {
          message += ' not';
        }

        message += ' to be emitted';

        if (this.not) {
          message += ' but it was';
        } else {
          message += ' but it was not';
        }

        message += '\nEvents:\n';
        message += eventBus.events.map((event) => this.formatValue(event)).join('\n');

        return message;
      },
    });
  },
};
