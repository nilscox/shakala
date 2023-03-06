import assert from 'assert';
import EventEmitter from 'events';

import { ClassType } from '@shakala/shared';
import { Container, DependencyModule, Token } from 'brandi';

import { EventHandler } from '../cqs/event-handler';
import { DomainEvent } from '../ddd/domain-event';
import { TOKENS } from '../tokens';

export type ModuleConfig<M extends Module> = M extends { configure(config: infer Config): void }
  ? Config
  : never;

export interface Module {
  configure(config?: unknown): void;
  init?(): Promise<void>;
}

export abstract class Module extends DependencyModule {
  private name: string;

  constructor(protected readonly container: Container) {
    super();
    this.name = new.target.name;
  }

  get logger() {
    const logger = this.container.get(TOKENS.logger);

    logger.tag = this.name;

    return logger;
  }

  get commandBus() {
    return this.container.get(TOKENS.commandBus);
  }

  get queryBus() {
    return this.container.get(TOKENS.queryBus);
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
