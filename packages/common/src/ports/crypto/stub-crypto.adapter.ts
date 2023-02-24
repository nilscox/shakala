import { CryptoPort } from './crypto.port';

export class StubCryptoAdapter implements CryptoPort {
  async hash(input: string): Promise<string> {
    return '#' + input + '#';
  }

  async compare(hashed: string, input: string): Promise<boolean> {
    return hashed === (await this.hash(input));
  }
}
