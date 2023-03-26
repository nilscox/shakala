import expect, { assertion, AssertionFailed } from '@nilscox/expect';
import { Stub } from '@shakala/shared';

import { StubEventPublisher } from './utils/stub-event-publisher';

// todo: this doesn't feel right
const assertions: Record<string, unknown> = expect._assertions;
delete assertions.toHavePublished;
delete assertions.called;
delete assertions.calledWith;

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
    expect.assert(Array.isArray(error.actual));

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
