import bcrypt from 'bcrypt';
import { injectable } from 'inversify';

export const CryptoServiceToken = Symbol('CryptoServiceToken');

export interface CryptoService {
  hash(input: string): Promise<string>;
  compare(hashed: string, input: string): Promise<boolean>;
}

@injectable()
export class BcryptService implements CryptoService {
  async hash(input: string): Promise<string> {
    return bcrypt.hash(input, 10);
  }

  async compare(input: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(input, hashed);
  }
}
