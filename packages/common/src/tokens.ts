import { token } from 'brandi';

import { EventPublisher } from './cqs/event-publisher';
import { CryptoPort } from './ports/crypto/crypto.port';
import { GeneratorPort } from './ports/generator/generator.port';

export const TOKENS = {
  generator: token<GeneratorPort>('generator'),
  crypto: token<CryptoPort>('crypto'),
  publisher: token<EventPublisher>('publisher'),
};
