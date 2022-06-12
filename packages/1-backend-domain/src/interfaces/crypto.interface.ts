export interface CryptoService {
  hash(input: string): Promise<string>;
  compare(hashed: string, input: string): Promise<boolean>;
}
