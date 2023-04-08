import EventEmitter from 'events';

import {
  DomainEvent,
  getEventHandlers,
  LoggerPort,
  module as commonModule,
  Module,
  TOKENS,
} from '@shakala/common';
import { module as emailModule } from '@shakala/email';
import { module as notificationModule } from '@shakala/notification';
import { module as persistenceModule } from '@shakala/persistence';
import { module as threadModule } from '@shakala/thread';
import { module as userModule } from '@shakala/user';

import { module as apiModule } from '../api.module';
import { container } from '../container';

export class Application {
  private modules: Module[] = [
    commonModule,
    persistenceModule,
    emailModule,
    notificationModule,
    userModule,
    threadModule,
    apiModule,
  ];

  private logger: LoggerPort;

  constructor() {
    this.logger = container.get(TOKENS.logger);
    this.logger.tag = Application.name;
  }

  async init() {
    await this.forEachModule(async (module) => {
      if (module.init) {
        this.logger.verbose(`initializing ${module.constructor.name}`);
        await module.init(container);
      }
    });

    this.configureEventHandlers();

    this.logger.verbose('application initialized');
  }

  async close() {
    await this.forEachModule(async (module) => {
      if (module.close) {
        this.logger.verbose(`closing ${module.constructor.name}`);
        await module.close(container);
      }
    });

    this.logger.info('application closed');
  }

  private configureEventHandlers() {
    const publisher = container.get(TOKENS.publisher);

    if (!(publisher instanceof EventEmitter)) {
      return;
    }

    this.logger.verbose('registering event handlers');

    for (const [EventClass, handlerTokens] of getEventHandlers()) {
      for (const token of handlerTokens) {
        const handler = container.get(token);

        this.logger.verbose('registering', handler.constructor.name, 'on', EventClass.name);

        publisher.on(EventClass.name, (event: DomainEvent) => {
          handler.handle(event).catch((error) => {
            // todo: report error
            console.log(error);
          });
        });
      }
    }
  }

  private async forEachModule(cb: (module: Module) => Promise<void>) {
    for (const module of Object.values<Module>(this.modules)) {
      await cb(module);
    }
  }
}
