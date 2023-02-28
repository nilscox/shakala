import { ClassType } from '@shakala/shared';
import { Token } from 'brandi';

import { EventHandler } from '../cqs/event-handler';
import { DomainEvent } from '../ddd/domain-event';

export interface BindEventListener {
  <Event extends DomainEvent>(event: ClassType<Event>, handlerToken: Token<EventHandler<Event>>): void;
}

export interface SetupListeners {
  (bind: BindEventListener): void;
}
