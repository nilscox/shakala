import { token } from 'brandi';

import { CommandBus } from './adapters/command-bus/command-bus.port';
import { ConfigPort } from './adapters/config/config.port';
import { CryptoPort } from './adapters/crypto/crypto.port';
import { FilesystemPort } from './adapters/filesystem/filesystem.port';
import { GeneratorPort } from './adapters/generator/generator.port';
import { LoggerPort } from './adapters/logger/logger.port';
import { QueryBus } from './adapters/query-bus/query-bus.port';
import { EventPublisher } from './cqs/event-publisher';

export const TOKENS = {
  commandBus: token<CommandBus>('commandBus'),
  config: token<ConfigPort>('config'),
  crypto: token<CryptoPort>('crypto'),
  filesystem: token<FilesystemPort>('filesystem'),
  generator: token<GeneratorPort>('generator'),
  logger: token<LoggerPort>('logger'),
  publisher: token<EventPublisher>('publisher'),
  queryBus: token<QueryBus>('queryBus'),
};
