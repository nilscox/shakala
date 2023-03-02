import { randomUUID } from 'crypto';

import { customAlphabet } from 'nanoid';

import { GeneratorPort } from './generator.port';

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 12);

export class NanoidGeneratorAdapter implements GeneratorPort {
  async generateId(): Promise<string> {
    return nanoid();
  }

  async generateToken(): Promise<string> {
    return randomUUID();
  }
}
