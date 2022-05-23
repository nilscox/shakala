import bcrypt from 'bcrypt';

export const CryptoToken = Symbol('CryptoToken');

export interface CryptoService {
  hash(input: string): Promise<string>;
  compare(hashed: string, input: string): Promise<boolean>;
}

export class BcryptService implements CryptoService {
  async hash(input: string): Promise<string> {
    return bcrypt.hash(input, 10);
  }

  async compare(input: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(input, hashed);
  }
}
