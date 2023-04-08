
import { Container } from 'brandi';

import { LocalCommandBus } from './adapters/command-bus/local-command-bus';
import { EnvConfigAdapter } from './adapters/config/env-config.adapter';
import { BcryptAdapter } from './adapters/crypto/bcrypt.adapter';
import { NativeDateAdapter } from './adapters/date/native-date.adapter';
import { LocalFilesystemAdapter } from './adapters/filesystem/local-filesystem.adapter';
import { NanoidGeneratorAdapter } from './adapters/generator/nanoid-generator.adapter';
import { ConsoleLoggerAdapter } from './adapters/logger/console-logger.adapter';
import { EmitterEventPublisher } from './adapters/publisher/emitter-event-publisher';
import { LocalQueryBus } from './adapters/query-bus/local-query-bus.adapter';
import { TOKENS } from './tokens';
import { Module } from './utils/module';

class CommonModule extends Module {
  init(container: Container) {
    this.expose(container, TOKENS);

    const commandBus = container.get(TOKENS.commandBus);
    if (commandBus instanceof LocalCommandBus) {
      commandBus.setContainer(container);
    }

    const queryBus = container.get(TOKENS.queryBus);
    if (queryBus instanceof LocalQueryBus) {
      queryBus.setContainer(container);
    }
  }
}

export const module = new CommonModule()

module.bind(TOKENS.logger).toInstance(ConsoleLoggerAdapter).inTransientScope();

module.bind(TOKENS.commandBus).toInstance(LocalCommandBus).inSingletonScope();
module.bind(TOKENS.queryBus).toInstance(LocalQueryBus).inSingletonScope();

module.bind(TOKENS.generator).toInstance(NanoidGeneratorAdapter).inSingletonScope();

module.bind(TOKENS.config).toInstance(EnvConfigAdapter).inSingletonScope();
module.bind(TOKENS.crypto).toInstance(BcryptAdapter).inSingletonScope();
module.bind(TOKENS.date).toInstance(NativeDateAdapter).inSingletonScope();
module.bind(TOKENS.filesystem).toInstance(LocalFilesystemAdapter).inSingletonScope();
module.bind(TOKENS.publisher).toInstance(EmitterEventPublisher).inSingletonScope();
