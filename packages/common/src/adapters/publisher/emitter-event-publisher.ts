import EventEmitter from 'events';

import { injected } from 'brandi';

import { EventPublisher } from '../../cqs/event-publisher';
import { DomainEvent } from '../../ddd/domain-event';
import { TOKENS } from '../../tokens';
import { LoggerPort } from '../logger/logger.port';

export class EmitterEventPublisher extends EventEmitter implements EventPublisher {
  constructor(private readonly logger: LoggerPort) {
    super();
    this.logger.tag = EmitterEventPublisher.name;
  }

  publish(event: DomainEvent): void {
    this.logger.info(event.constructor.name, event.id);
    this.emit(event.constructor.name, event);
  }
}

injected(EmitterEventPublisher, TOKENS.logger);
