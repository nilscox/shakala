import { token } from 'brandi';

import { EventPublisher } from './cqs/event-publisher';
import { CommandBus } from './ports/command-bus/command-bus.port';
import { ConfigPort } from './ports/config/config.port';
import { CryptoPort } from './ports/crypto/crypto.port';
import { FilesystemPort } from './ports/filesystem/filesystem.port';
import { GeneratorPort } from './ports/generator/generator.port';
import { LoggerPort } from './ports/logger/logger.port';

export const TOKENS = {
  commandBus: token<CommandBus>('commandBus'),
  config: token<ConfigPort>('config'),
  crypto: token<CryptoPort>('crypto'),
  filesystem: token<FilesystemPort>('filesystem'),
  generator: token<GeneratorPort>('generator'),
  logger: token<LoggerPort>('logger'),
  publisher: token<EventPublisher>('publisher'),
};
