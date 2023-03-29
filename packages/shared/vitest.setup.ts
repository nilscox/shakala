import expect, { assertion, AssertionFailed } from '@nilscox/expect';

import { Stub } from './src/utils/stub';

declare global {
  namespace Expect {
    export interface StubAssertions extends FunctionAssertions<Stub<unknown, unknown[]>> {
      called(): void;
      calledWith<Args extends unknown[]>(...args: Args): void;
    }

    export interface Assertions extends StubAssertions {}

    interface ExpectFunction {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <Actual extends Stub<any, any[]>>(actual: Actual): ExpectResult<StubAssertions, Actual>;
    }
  }
}

// todo: this doesn't feel right
const assertions: Record<string, unknown> = expect._assertions;
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
