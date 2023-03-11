import EventEmitter from 'events';

import {
  CommonModule,
  DomainEvent,
  getEventHandlers,
  LoggerPort,
  Module,
  ModuleConfig,
  TOKENS,
} from '@shakala/common';
import { EmailModule } from '@shakala/email';
import { NotificationModule } from '@shakala/notification';
import { ThreadModule } from '@shakala/thread';
import { UserModule } from '@shakala/user';

import { ApiModule } from '../api.module';
import { container } from '../container';

type Modules = {
  common: CommonModule;
  user: UserModule;
  email: EmailModule;
  notification: NotificationModule;
  thread: ThreadModule;
  api: ApiModule;
};

export type ApplicationConfig = {
  [Key in keyof Modules]: ModuleConfig<Modules[Key]>;
};

export class Application {
  private modules: Modules = {
    common: new CommonModule(container),
    user: new UserModule(container),
    email: new EmailModule(container),
    notification: new NotificationModule(container),
    thread: new ThreadModule(container),
    api: new ApiModule(container),
  };

  private logger: LoggerPort;

  constructor(config: ApplicationConfig) {
    container.bind(TOKENS.container).toConstant(container);

    for (const [key, module] of Object.entries<Module>(this.modules)) {
      module.configure(config[key as keyof Modules]);
    }

    this.logger = container.get(TOKENS.logger);
    this.logger.tag = Application.name;
  }

  async init() {
    for (const module of Object.values<Module>(this.modules)) {
      await module.init?.();
    }

    this.configureEventHandlers();
  }

  async close() {
    this.logger.info('application closed');
  }

  private configureEventHandlers() {
    const publisher = container.get(TOKENS.publisher);

    if (!(publisher instanceof EventEmitter)) {
      return;
    }

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
}
