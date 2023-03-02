import assert from 'assert';
import EventEmitter from 'events';

import { ClassType } from '@shakala/shared';
import { Container, DependencyModule, Token } from 'brandi';

import { CommandHandler } from '../cqs/command-handler';
import { EventHandler } from '../cqs/event-handler';
import { QueryHandler } from '../cqs/query-handler';
import { DomainEvent } from '../ddd/domain-event';
import { LocalCommandBus } from '../ports/command-bus/local-command-bus';
import { LoggerPort } from '../ports/logger/logger.port';
import { LocalQueryBus } from '../ports/query-bus/local-query-bus.adapter';
import { TOKENS } from '../tokens';

export abstract class Module extends DependencyModule {
  logger: LoggerPort;

  constructor(protected readonly container: Container) {
    super();
    this.logger = container.get(TOKENS.logger);
    this.logger.tag = new.target.name;
  }

  abstract init(): Promise<void>;

  get commandBus() {
    const commandBus = this.container.get(TOKENS.commandBus);

    assert(commandBus instanceof LocalCommandBus);

    return commandBus;
  }

  get queryBus() {
    const queryBus = this.container.get(TOKENS.queryBus);

    assert(queryBus instanceof LocalQueryBus);

    return queryBus;
  }

  protected registerCommandHandler(token: Token<CommandHandler<unknown>>) {
    const handler = this.container.get(token);

    this.logger.verbose('registering command', handler.constructor.name);
    this.commandBus.register(handler);
  }

  protected registerQueryHandler(token: Token<QueryHandler<unknown, unknown>>) {
    const handler = this.container.get(token);

    this.logger.verbose('registering query', handler.constructor.name);
    this.queryBus.register(handler);
  }

  protected bindToken<Cls>(token: Token<Cls>, Instance: ClassType<Cls>) {
    this.logger.verbose('binding', Instance.name);
    this.bind(token).toInstance(Instance).inContainerScope();
    this.container.use(token).from(this);
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
