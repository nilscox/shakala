import { randomUUID } from 'crypto';

import { GeneratorPort } from '@shakala/common';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 12);

export class NanoidGeneratorAdapter implements GeneratorPort {
  async generateId(): Promise<string> {
    return nanoid();
  }

  async generateToken(): Promise<string> {
    return randomUUID();
  }
}
