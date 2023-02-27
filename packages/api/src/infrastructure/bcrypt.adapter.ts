import { CryptoPort } from '@shakala/common';
import * as bcrypt from 'bcrypt';

export class BcryptAdapter implements CryptoPort {
  async hash(input: string): Promise<string> {
    return bcrypt.hash(input, 12);
  }

  async compare(hashed: string, input: string): Promise<boolean> {
    return bcrypt.compare(input, hashed);
  }
}
