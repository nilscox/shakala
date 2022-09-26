import { CryptoPort } from '../interfaces/crypto.interface';

export class StubCryptoAdapter implements CryptoPort {
  async hash(input: string): Promise<string> {
    return '#' + input;
  }

  async compare(input: string, hashed: string): Promise<boolean> {
    return hashed === '#' + input;
  }
}
