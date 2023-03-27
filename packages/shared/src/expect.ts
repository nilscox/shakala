import '@nilscox/expect';

import { Stub } from './utils/stub';

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
