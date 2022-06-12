import type { CryptoService } from 'backend-domain';

export class StubCryptoService implements CryptoService {
  async hash(input: string): Promise<string> {
    return input;
  }

  async compare(input: string, hashed: string): Promise<boolean> {
    return hashed === '#' + input;
  }
}
