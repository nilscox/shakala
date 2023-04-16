import '@nilscox/expect';

import { AnyDomainEvent } from './ddd/domain-event';
import { StubEventPublisher } from './utils/stub-event-publisher';

declare global {
  namespace Expect {
    export interface EventPublisherAssertions extends ObjectAssertions<StubEventPublisher> {
      toHavePublished<Event extends AnyDomainEvent>(event: Event): Event;
    }

    export interface Assertions extends EventPublisherAssertions {}

    interface ExpectFunction {
      <Actual extends StubEventPublisher>(actual: Actual): ExpectResult<EventPublisherAssertions, Actual>;
    }
  }
}
