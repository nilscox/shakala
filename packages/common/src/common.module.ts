import { LocalCommandBus } from './adapters/command-bus/local-command-bus';
import { EnvConfigAdapter } from './adapters/config/env-config.adapter';
import { BcryptAdapter } from './adapters/crypto/bcrypt.adapter';
import { NativeDateAdapter } from './adapters/date/native-date.adapter';
import { LocalFilesystemAdapter } from './adapters/filesystem/local-filesystem.adapter';
import { NanoidGeneratorAdapter } from './adapters/generator/nanoid-generator.adapter';
import { ConsoleLoggerAdapter } from './adapters/logger/console-logger.adapter';
import { StubLoggerAdapter } from './adapters/logger/stub-logger.port';
import { EmitterEventPublisher } from './adapters/publisher/emitter-event-publisher';
import { LocalQueryBus } from './adapters/query-bus/local-query-bus.adapter';
import { TOKENS } from './tokens';
import { Module } from './utils/module';

type CommonModuleConfig = {
  logger: 'stub' | 'console';
};

export class CommonModule extends Module {
  configure(config: CommonModuleConfig): void {
    if (config.logger === 'stub') {
      this.container.bind(TOKENS.logger).toInstance(StubLoggerAdapter).inTransientScope();
    } else {
      this.container.bind(TOKENS.logger).toInstance(ConsoleLoggerAdapter).inTransientScope();
    }

    this.bindToken(TOKENS.commandBus, LocalCommandBus);
    this.bindToken(TOKENS.config, EnvConfigAdapter);
    this.bindToken(TOKENS.crypto, BcryptAdapter);
    this.bindToken(TOKENS.date, NativeDateAdapter);
    this.bindToken(TOKENS.filesystem, LocalFilesystemAdapter);
    this.bindToken(TOKENS.generator, NanoidGeneratorAdapter);
    this.bindToken(TOKENS.publisher, EmitterEventPublisher);
    this.bindToken(TOKENS.queryBus, LocalQueryBus);
  }
}
