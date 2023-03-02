import assert from 'assert';

import expect, { assertion, AssertionFailed } from '@nilscox/expect';

import { DomainEvent } from './ddd/domain-event';
import { Stub } from './utils/stub';
import { StubEventPublisher } from './utils/stub-event-publisher';

declare global {
  namespace Expect {
    export interface StubAssertions extends FunctionAssertions<Stub<unknown, unknown[]>> {
      called(): void;
      calledWith<Args extends unknown[]>(...args: Args): void;
    }

    export interface EventPublisherAssertions {
      toHavePublished<Event extends DomainEvent>(event: Event): Event;
    }

    export interface Assertions extends StubAssertions, EventPublisherAssertions {}

    interface ExpectFunction {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <Actual extends Stub<any, any[]>>(actual: Actual): ExpectResult<StubAssertions, Actual>;
      <Actual extends StubEventPublisher>(actual: Actual): ExpectResult<EventPublisherAssertions, Actual>;
    }
  }
}

expect.addAssertion({
  name: 'called',

  expectedType: 'a stub',
  guard(value): value is Stub<unknown, unknown[]> {
    return typeof value === 'function' && 'calls' in value;
  },

  prepare(stub) {
    return {
      actual: stub.lastCall,
    };
  },

  assert(lastCall) {
    assertion(lastCall !== undefined);
  },

  getMessage(error) {
    return this.formatter.expected(error.subject).not.append('to have been called').result();
  },
});

expect.addAssertion({
  name: 'calledWith',

  expectedType: 'a stub',
  guard(value): value is Stub<unknown, unknown[]> {
    return typeof value === 'function' && 'calls' in value;
  },

  prepare(stub, ...args) {
    return {
      actual: stub.calls,
      meta: {
        args,
      },
    };
  },

  assert(calls, _, { args }) {
    for (const call of calls) {
      if (this.compare(call, args)) {
        return;
      }
    }

    throw new AssertionFailed();
  },

  getMessage(error) {
    return this.formatter
      .expected(error.subject)
      .not.append('to have been called with')
      .value(error.meta.args)
      .append('\ncalls:')
      .value(error.actual)
      .result();
  },
});

expect.addAssertion({
  name: 'toHavePublished',

  expectedType: 'an instance of StubEventPublisher',
  guard(value): value is StubEventPublisher {
    return value instanceof StubEventPublisher;
  },

  prepare(publisher, event) {
    return {
      actual: publisher.events,
      meta: {
        event,
      },
    };
  },

  assert(events, _, { event: expected }) {
    for (const event of events) {
      // todo: check in this.compare
      if (event.constructor !== expected.constructor) {
        continue;
      }

      if (this.compare(event, expected)) {
        return event;
      }
    }

    throw new AssertionFailed();
  },

  getMessage(error) {
    assert(Array.isArray(error.actual));

    const events = error.actual
      .map((value) => this.formatValue(value))
      .map((str) => `- ${str}`)
      .join('\n');

    return this.formatter
      .append('expected event publisher')
      .not.append('to have published')
      .value(error.meta.event)
      .append('\nEvents:')
      .append(events ? '\n' + events : '(none)')
      .result();
  },
});

export { expect };
