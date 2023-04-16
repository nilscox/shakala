import EventEmitter from 'events';

import { injected } from 'brandi';

import { EventPublisher, TransactionalEventPublisher } from '../../cqs/event-publisher';
import { DomainEvent } from '../../ddd/domain-event';
import { TOKENS } from '../../tokens';
import { LoggerPort } from '../logger/logger.port';

export class EmitterEventPublisher extends EventEmitter implements EventPublisher {
  constructor(private readonly logger: LoggerPort) {
    super();
    this.logger.tag = EmitterEventPublisher.name;
  }

  publish(event: DomainEvent): void {
    if (event.details) {
      this.logger.info(event.constructor.name, event.id, event.details);
    } else {
      this.logger.info(event.constructor.name, event.id);
    }

    this.emit(event.constructor.name, event);
  }

  begin(): TransactionalEventPublisher {
    const events = new Set<DomainEvent>();

    return {
      addEvent: events.add.bind(events),
      commit: () => events.forEach(this.publish.bind(this)),
    };
  }
}

injected(EmitterEventPublisher, TOKENS.logger);
