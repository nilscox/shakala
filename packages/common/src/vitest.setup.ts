import expect, { AssertionFailed } from '@nilscox/expect';

import { StubEventPublisher } from './utils/stub-event-publisher';

// todo: this doesn't feel right
const assertions: Record<string, unknown> = expect._assertions;
delete assertions.toHavePublished;

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
