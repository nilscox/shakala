import { token } from 'brandi';

import { EventPublisher } from './cqs/event-publisher';
import { ConfigPort } from './ports/config/config.port';
import { CryptoPort } from './ports/crypto/crypto.port';
import { FilesystemPort } from './ports/filesystem/filesystem.port';
import { GeneratorPort } from './ports/generator/generator.port';

export const TOKENS = {
  config: token<ConfigPort>('config'),
  filesystem: token<FilesystemPort>('filesystem'),
  generator: token<GeneratorPort>('generator'),
  crypto: token<CryptoPort>('crypto'),
  publisher: token<EventPublisher>('publisher'),
};
