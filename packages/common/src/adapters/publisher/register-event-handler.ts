import { ClassType } from '@shakala/shared';
import { Token } from 'brandi';

import { EventHandler } from '../../cqs/event-handler';
import { AnyDomainEvent } from '../../ddd/domain-event';

const eventHandlers = new Map<ClassType<AnyDomainEvent>, Token<EventHandler<AnyDomainEvent>>[]>();

export const registerEventHandler = <Event extends AnyDomainEvent>(
  EventClass: ClassType<Event>,
  handlerToken: Token<EventHandler<Event>>
) => {
  const handlers = eventHandlers.get(EventClass) ?? [];

  if (!eventHandlers.has(EventClass)) {
    eventHandlers.set(EventClass, handlers);
  }

  handlers.push(handlerToken);
};

export const getEventHandlers = () => {
  return Array.from(eventHandlers.entries());
};
