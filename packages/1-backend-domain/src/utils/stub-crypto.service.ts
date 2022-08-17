import { CryptoService } from '../interfaces/crypto.interface';

export class StubCryptoService implements CryptoService {
  async hash(input: string): Promise<string> {
    return '#' + input;
  }

  async compare(input: string, hashed: string): Promise<boolean> {
    return hashed === '#' + input;
  }
}
