import { LocalCommandBus } from './adapters/command-bus/local-command-bus';
import { StubCommandBus } from './adapters/command-bus/stub-command-bus.adapter';
import { EnvConfigAdapter } from './adapters/config/env-config.adapter';
import { BcryptAdapter } from './adapters/crypto/bcrypt.adapter';
import { NativeDateAdapter } from './adapters/date/native-date.adapter';
import { LocalFilesystemAdapter } from './adapters/filesystem/local-filesystem.adapter';
import { NanoidGeneratorAdapter } from './adapters/generator/nanoid-generator.adapter';
import { StubGeneratorAdapter } from './adapters/generator/stub-generator.adapter';
import { ConsoleLoggerAdapter } from './adapters/logger/console-logger.adapter';
import { StubLoggerAdapter } from './adapters/logger/stub-logger.port';
import { EmitterEventPublisher } from './adapters/publisher/emitter-event-publisher';
import { LocalQueryBus } from './adapters/query-bus/local-query-bus.adapter';
import { StubQueryBus } from './adapters/query-bus/stub-query-bus.adapter';
import { TOKENS } from './tokens';
import { Module } from './utils/module';

type CommonModuleConfig = {
  logger: 'stub' | 'console';
  buses: 'stub' | 'local';
  generator: 'stub' | 'nanoid';
};

export class CommonModule extends Module {
  configure(config: CommonModuleConfig): void {
    if (config.logger === 'stub') {
      this.container.bind(TOKENS.logger).toInstance(StubLoggerAdapter).inTransientScope();
    } else {
      this.container.bind(TOKENS.logger).toInstance(ConsoleLoggerAdapter).inTransientScope();
    }

    if (config.buses === 'stub') {
      this.bindToken(TOKENS.commandBus, StubCommandBus);
      this.bindToken(TOKENS.queryBus, StubQueryBus);
    } else {
      this.bindToken(TOKENS.commandBus, LocalCommandBus);
      this.bindToken(TOKENS.queryBus, LocalQueryBus);
    }

    if (config.generator === 'stub') {
      this.bindToken(TOKENS.generator, StubGeneratorAdapter);
    } else {
      this.bindToken(TOKENS.generator, NanoidGeneratorAdapter);
    }

    this.bindToken(TOKENS.config, EnvConfigAdapter);
    this.bindToken(TOKENS.crypto, BcryptAdapter);
    this.bindToken(TOKENS.date, NativeDateAdapter);
    this.bindToken(TOKENS.filesystem, LocalFilesystemAdapter);
    this.bindToken(TOKENS.publisher, EmitterEventPublisher);
  }
}
