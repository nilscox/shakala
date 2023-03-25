import expect from '@nilscox/expect';
import { Stub } from '@shakala/shared';

import { DomainEvent } from './ddd/domain-event';
import { StubEventPublisher } from './utils/stub-event-publisher';

export { expect };

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
