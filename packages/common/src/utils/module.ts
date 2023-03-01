import assert from 'assert';
import EventEmitter from 'events';

import { ClassType } from '@shakala/shared';
import { Container, DependencyModule, Token } from 'brandi';

import { CommandHandler } from '../cqs/command-handler';
import { EventHandler } from '../cqs/event-handler';
import { DomainEvent } from '../ddd/domain-event';
import { LocalCommandBus } from '../ports/command-bus/local-command-bus';
import { TOKENS } from '../tokens';

export abstract class Module extends DependencyModule {
  constructor(protected readonly container: Container) {
    super();
  }

  get commandBus() {
    const commandBus = this.container.get(TOKENS.commandBus);

    assert(commandBus instanceof LocalCommandBus);

    return commandBus;
  }

  protected registerCommandHandler(token: Token<CommandHandler<unknown>>) {
    this.commandBus.register(this.container.get(token));
  }

  protected bindToken<Cls>(token: Token<Cls>, Instance: ClassType<Cls>) {
    this.bind(token).toInstance(Instance).inContainerScope();
  }

  protected bindEventListener<Event extends DomainEvent>(
    EventClass: ClassType<Event>,
    handlerToken: Token<EventHandler<Event>>
  ) {
    const publisher = this.container.get(TOKENS.publisher);
    const handler = this.container.get(handlerToken);

    assert(publisher instanceof EventEmitter);

    publisher.on(EventClass.name, (event: Event) => {
      handler.handle(event).catch((error) => {
        // todo: report error
        console.log(error);
      });
    });
  }
}
