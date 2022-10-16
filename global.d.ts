import { Expect } from '@nilscox/expect';
import '@nilscox/expect-sinon';

declare global {
  // eslint-disable-next-line no-var
  var expect: Expect;
}
